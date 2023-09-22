const PAPAGO_API_ENDPOINT = "https://openapi.naver.com/v1/papago/n2mt";
const CLIENT_ID = "QCj7kGXAcHcexd7vvQHy"; // Removed for security
const CLIENT_SECRET = "StMNMqi6ak"; // Removed for security
const REST_API_KEY = config.apikey; // Removed for security

async function translateToEnglish(text) {
    const formData = new URLSearchParams();
    formData.append('source', 'ko');
    formData.append('target', 'en');
    formData.append('text', text);

    const requestOptions = {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-Naver-Client-Id": CLIENT_ID,
            "X-Naver-Client-Secret": CLIENT_SECRET
        },
        body: formData
    };

    try {
        const response = await fetch(PAPAGO_API_ENDPOINT, requestOptions);
        const data = await response.json();
        return data.message.result.translatedText;
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
function goToImageDesigner() {
    const imageUrl = document.getElementById('generatedImage').src;
    window.location.href = `imagedesigner.html?image_url=${encodeURIComponent(imageUrl)}`;
}
