function goToScroll(name) {
    var location = document.querySelector("." + name).offsetTop;
    window.scrollTo({top: location, behavior: 'smooth'});
}

/*Google Translator*/
const PAPAGO_API_ENDPOINT = "https://openapi.naver.com/v1/papago/n2mt";
const CLIENT_ID = "QCj7kGXAcHcexd7vvQHy"; // Removed for security
const CLIENT_SECRET = "StMNMqi6ak"; // Removed for security

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


/*Karlo API*/
const REST_API_KEY = config.apikey; // Removed for security
const submitIcon = document.querySelector(".button-generate")
// const imageSection = document.querySelector('#image-div')
var generatedImageUrl

const getImage = async () => {
    const promptText = document.querySelector("#prompt").value;
    const negativePromptText = document.querySelector('#negative-prompt').value;
    const translatedPrompt = await translateToEnglish(promptText);
    const translatedNegativePrompt = await translateToEnglish(negativePromptText);
    console.log(translatedPrompt);

    const options = {
        method: "POST",
        headers:{
            "Authorization": `KakaoAK ${REST_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "prompt": translatedPrompt,
            "negative_prompt": translatedNegativePrompt,
            "width": 512,
            "samples": 1,
            "upscale": true,
            "scale": 2
        })
    }
    try{
        const response = await fetch("https://api.kakaobrain.com/v2/inference/karlo/t2i", options)
        const data = await response.json()
        console.log(response)
        console.log(data)
        data?.images.forEach(imageObject => {
            console.log(imageObject.image)
            console.log(typeof imageObject.image)
            // const imageContainer = document.createElement('div')
            // imageContainer.classList.add('image-container')
            // const imageElement = document.createElement('img')
            // imageElement.setAttribute('src', imageObject.image)
            generatedImageUrl = imageObject.image
            console.log(generatedImageUrl)
            document.getElementById("result-image").setAttribute('src', imageObject.image)
            document.getElementById("downloadLink").setAttribute('href',imageObject.image)
            // imageContainer.append(imageElement)
            // imageSection.append(imageContainer)
            })
    } catch(error){
        console.error(error)
    }
}

submitIcon.addEventListener('click', getImage)
//submitIcon.addEventListener('click', goToScroll('button-generate'))

//generate image 생성시
function imageLoaded(){
    document.getElementById("downloadLink").style.display="block";
    document.getElementById("toggleButton").style.display="block";
    document.getElementById("imageEditButton").style.display="block";
}
var resultImage = document.getElementById("result-image")
resultImage.onload = imageLoaded;



/* 이메일 보내기 버튼 */
function togglePopup(popupId) {
    var popup = document.getElementById(popupId);
    popup.classList.toggle("active");
}

function Popup(popupId_val) {
    this.popupId = popupId_val;
}

// 팝업 객체 생성
var popup = new Popup("popup-1");

// 팝업 토글 예시
document.getElementById("toggleButton").addEventListener("click", function() {
    togglePopup(popup.popupId);
});


/*Edit Image 버튼 - ImageEditor 창으로 보내기*/

document.getElementById("imageEditButton").addEventListener("click", function() {
    // 이미지 URL을 가져와서 imageEditor.html 페이지로 전달
    var imageUrl = generatedImageUrl; // 이미지 URL을 여기에 적용
    window.location.href = "imageEditor.html?imageUrl=" + encodeURIComponent(imageUrl);
});