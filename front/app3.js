const PAPAGO_API_ENDPOINT = "https://openapi.naver.com/v1/papago/n2mt";
const CLIENT_ID = "QCj7kGXAcHcexd7vvQHy"; // Removed for security
const CLIENT_SECRET = "StMNMqi6ak"; // Removed for security
const REST_API_KEY = config.apikey; // Removed for security

// const API_KEY = 'AIzaSyB8J27rzg56JrptEx-pmNy2QPkVVlNZ9Sw'; // Removed for security

async function translateToEnglish(text) {
    const API_KEY = 'AIzaSyB8J27rzg56JrptEx-pmNy2QPkVVlNZ9Sw'; // 여기에 Google Cloud Platform에서 받은 API 키를 입력하세요.
    const endpoint = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;
    const body = {
        q: text,
        source: 'ko',
        target: 'en'
    };

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        return data.data.translations[0].translatedText;
    } catch (error) {
        console.error("Error during translation:", error);
        return null; // 또는 적절한 오류 메시지나 기본값을 반환할 수 있습니다.
    }
}

function goToScroll(name) {
    var location = document.querySelector("." + name).offsetTop;
    window.scrollTo({top: location, behavior: 'smooth'});
}

const generatedImage = document.getElementById("generatedImage");
const ratioInputs = document.querySelectorAll('input[name="frame-size"]');
const cropButton = document.getElementById("cropButton");
const previewImg = document.querySelector(".preview-img img");
const resetFilterBtn = document.querySelector(".reset-filter");

let cropper;

async function getImage() {
    const promptText = document.querySelector("#prompt").value;
    const negativePromptText = document.querySelector('#negative-prompt').value;
    const translatedPrompt = await translateToEnglish(promptText);
    const translatedNegativePrompt = await translateToEnglish(negativePromptText);

    const options = {
        method: "POST",
        headers:{
            "Authorization": `KakaoAK ${REST_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "prompt": translatedPrompt,
            "negative_prompt": translatedNegativePrompt,
            "width": 512,
            "samples": 1,
            "upscale": true,
            "scale": 4
        })
    };

    try {
        const response = await fetch("https://api.kakaobrain.com/v2/inference/karlo/t2i", options);
        const data = await response.json();

        handleGeneratedImage(data);
    } catch(error) {
        console.error(error);
    }
}

function handleGeneratedImage(data) {
    data?.images.forEach(imageObject => {
        const generatedImageUrl = imageObject.image;

        fetch(generatedImageUrl)
          .then(response => response.blob())
          .then(blob => {
            const url = URL.createObjectURL(blob);
            initializeCropper(url);
          })
          .catch(error => console.error(error));
    });
    ratioInputs.forEach(input => {
        input.addEventListener("change", function() {
            const selectedRatio = getSelectedRatio();
            let [w, h] = selectedRatio.split('x').map(Number);
            cropper.setAspectRatio(w/h);
        });
    });
}


// //생성된 이미지를 imagedesigner로 가져오게 하기위해 canvas에서 이미지 url 생성하기 
// let canvas = document.createElement('canvas');
// let ctx = canvas.getContext('2d');

// let img = new Image();
// img.onload = function() {
//     canvas.width = img.width;
//     canvas.height = img.height;
//     ctx.drawImage(img, 0, 0);
// };
// img.src = 'generatedImageUrl';
// let dataURL = canvas.toDataURL('image/png'); // image/png 형식의 Data URL 생성
// localStorage.setItem('imageDataURL', dataURL);
// let fetchedDataURL = localStorage.getItem('imageDataURL');
// document.getElementById('fetchedImage').src = fetchedDataURL; // 이미지 엘리먼트에 Data URL 설정


function initializeCropper(url) {
    if (cropper) {
        cropper.destroy();
    }
    cropper = new Cropper(generatedImage, {
        dragMode: 'move',
        aspectRatio: 3/4,
        autoCropArea: 0.8,
        restore: false,
        guides: false,
        center: false,
        highlight: false,
        toggleDragModeOnDblclick: false,
    });
    cropper.replace(url);
}

function getSelectedRatio() {
    const selectedRatioInput = document.querySelector('input[name="frame-size"]:checked');
    return selectedRatioInput.value;
}

document.querySelector(".button-generate").addEventListener('click', getImage);

cropButton.addEventListener("click", function() {
    const croppedImage = cropper.getCroppedCanvas();
    if(croppedImage) {
        previewImg.src = croppedImage.toDataURL();
        resetFilterBtn.click();
        document.querySelector(".container2").classList.remove("disable");
    }
});

// Additional refactoring can be applied to other sections of the code.
