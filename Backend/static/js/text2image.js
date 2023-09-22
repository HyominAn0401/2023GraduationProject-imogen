function goToScroll(name) {
    var location = document.querySelector("." + name).offsetTop;
    window.scrollTo({top: location, behavior: 'smooth'});
}

/*Karlo API*/
const REST_API_KEY = get_secret("apiKey")
const submitIcon = document.querySelector(".button-generate")
const inputElement = document.querySelector("#prompt")
const imageSection = document.querySelector('#image-div')
const NinputElement = document.querySelector('#negative-prompt')

const getImage = async () => {
    const options = {
        method: "POST",
        headers:{
            "Authorization": `KakaoAK ${REST_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "prompt": inputElement.value,
            "negative_prompt": NinputElement.value,
            "width": 512,
            //"upascale": true,
            //"scale": 2,
            // 객체가 센터에 존재하게객
            "samples": 1
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
            const imageContainer = document.createElement('div')
            imageContainer.classList.add('image-container')
            const imageElement = document.createElement('img')
            imageElement.setAttribute('src', imageObject.image)
            imageContainer.append(imageElement)
            imageSection.append(imageContainer)
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
