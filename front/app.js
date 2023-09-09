function goToScroll(name) {
    var location = document.querySelector("." + name).offsetTop;
    window.scrollTo({top: location, behavior: 'smooth'});
}

/*crop image*/
//import Cropper from 'cropperjs';
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
// var image = document.getElementById('image');
// const cropper = new Cropper(image, {
// //   aspectRatio: 3/4,
// //   viewMode:0,
//   dragMode: 'move',
//   aspectRatio: 3/4,
//   autoCropArea: 0.8,
//   restore: false,
//   guides: false,
//   center: false,
//   highlight: false,
//   //zoomable: false,
// //   cropBoxMovable: false,
// //   cropBoxResizable: false,
//   toggleDragModeOnDblclick: false,
<<<<<<< Updated upstream

//   crop(event) {
//     console.log(event.detail.x);
//     console.log(event.detail.y);
//     console.log(event.detail.width);
//     console.log(event.detail.height);
//     console.log(event.detail.rotate);
//     console.log(event.detail.scaleX);
//     console.log(event.detail.scaleY);
//   },

// });

// 임의의 버튼 + cropper 만들기
var imgurl= "https://cdn.aitimes.kr/news/photo/202303/27617_41603_044.jpg"
const tempBtn = document.getElementById("#button-temp")
var imageTemp = document.getElementById('#imageTemp');

const changeImg = () => {
    
    //특정 img src를 가지는 cropper 객체 생성
    let cropperTemp = new Cropper(imageTemp,{
        dragMode: 'move',
        aspectRatio: 3/4,
        autoCropArea: 0.8,
        restore: false,
        guides: false,
        center: false,
        highlight: false,
        toggleDragModeOnDblclick: false,

        crop(event) {
            console.log(event.detail.x);
            console.log(event.detail.y);
            console.log(event.detail.width);
            console.log(event.detail.height);
            console.log(event.detail.rotate);
            console.log(event.detail.scaleX);
            console.log(event.detail.scaleY);
            },
            
    });
    console.log("cropper 실행됨")
    cropperTemp.replace(imgurl)
}
window.onload = function(){
    tempBtn.addEventListener("click", changeImg);
}

=======

//   crop(event) {
//     console.log(event.detail.x);
//     console.log(event.detail.y);
//     console.log(event.detail.width);
//     console.log(event.detail.height);
//     console.log(event.detail.rotate);
//     console.log(event.detail.scaleX);
//     console.log(event.detail.scaleY);
//   },

// });


/*temp create img and crop img*/
document.addEventListener("DOMContentLoaded", function(){
    const imageInput = document.getElementById("imageInput");
    const createButton = document.getElementById("createButton");
    const generatedImage = document.getElementById("generatedImage");
    const croppedCanvas = document.getElementById("croppedCanvas");
    const ratioInputs = document.querySelectorAll('input[name="frame-size"]');
    const cropButton = document.getElementById("cropButton")
    const previewImg = document.querySelector(".preview-img img");

    let cropper;

    createButton.addEventListener("click", async function(){
        //generative AI 모델 호출
        //const generatedImageUrl = await generatedImage(); //Gen AI 모델 호출하고 생성된 이미지 URL 반환 ** 비동기 동작 **
        generatedImage.src = "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg";

        //이미지가 로드된 후 Cropper.js 인스턴스 생성
        if (cropper) {
            cropper.destroy();
        }

        cropper = new Cropper(generatedImage,{
            dragMode: 'move',
            aspectRatio: 3/4,
            autoCropArea: 0.8,
            restore: false,
            guides: false,
            center: false,
            highlight: false,
            toggleDragModeOnDblclick: false,
        });

        //라디오 버튼의 변경 이벤트 핸들러를 추가
        ratioInputs.forEach(function(input){
            input.addEventListener("change", function(){
                const selectedRatio = getSelectedRatio();
                let words = selectedRatio.split('x')
                var w = Number(words[0])
                var h = Number(words[1])
                cropper.setAspectRatio(w/h);
            });
        });
    });

    cropButton.addEventListener("click", function() {
        //Crop버튼 클릭 시 크롭된 이미지를 얻어옴
        const croppedImage = cropper.getCroppedCanvas();

        //크롭된 이미지를 화면에 표시하거나 서버에 업로드하거나 다른 작업 수행 가능
        if(croppedImage){
            //크롭된 이미지를 화면에 표시(예: 이미지 요소에 설정)
            const previewImg = document.querySelector(".preview-img img");  //이미지 요소 선택
            previewImg.src = croppedImage.toDataURL(); //크롭된 이미지를 Data URL로 변환해 src에 설정
        }
    });

    //async function generateImage() //Gen AI 모델 호출

    function getSelectedRatio(){
        //선택된 라디오 버튼의 값에 따라 적절한 비율 반환
        var selectedRatioInput = document.querySelector('input[name="frame-size"]:checked');
        return selectedRatioInput.value
    }
})
>>>>>>> Stashed changes

// 16/4를 숫자로 받지 않기 때문에. 문자열 split해서 w, h를 따로 받고 Number로 형변환 후 넣어주기

/*crop 비율 바꾸기*/
// 라디오 버튼 클릭시 호출되는 함수
// var w;  // 가로 비율
// var h;  // 세로비율
// function changeRatio(){
    
//     var options = document.getElementsByName("frame-size");
//     console.log(options[0].value)

//     for (var i = 0; i < options.length; i++) {
//         if (options[i].checked) {
//             // 선택된 라디오 버튼의 값을 가져와서 표시
//             let words = options[i].value.split('x');
//             console.log(words[0]);
//             console.log(words[1]);
//             w = Number(words[0]);
//             h = Number(words[1]);
//             console.log(typeof Number(words[0]));
//             console.log(typeof Number(words[1]));
//             cropper.setAspectRatio(w/h)
//             break;
//         }
//     }

// }
// // 라디오 버튼 클릭 이벤트에 함수 연결
// var radioButtons = document.getElementsByName("frame-size");
// for (var i = 0; i < radioButtons.length; i++) {
//     radioButtons[i].addEventListener("click", changeRatio);
// }



//const cropboxData = cropper.setCropBoxdata({left:0, top:0, width:100, height:100 })

// document.getElementById('cropImageBtn').addEventListener("click",
// function(){
//     var croppedImage = cropper.getCroppedCanvas().toDataURL("image/png");
//     alert(croppedImage);

// })


/*Karlo API*/
const REST_API_KEY = config.apikey;
const submitIcon = document.querySelector(".button-generate")
const inputElement = document.querySelector("#prompt")
const imageSection = document.querySelector('.image-section')
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
            // const imageContainer = document.createElement('div')
            // imageContainer.classList.add('image-container')
            // const imageElement = document.createElement('img')
            // imageElement.setAttribute('src', imageObject.image)
            // imageContainer.append(imageElement)
            // imageSection.append(imageContainer)
            cropper.destroy()
            image.src = imageObject.image
            cropper = new Cropper(image,{
                aspectRatio: 4/3,
                dragMode: 'move',
                autoCropArea: 0.8,
                restore: false,
                guides: false,
                center: false,
                highlight: false,
                toggleDragModeOnDblclick: false,

                crop(event) {
                    console.log(event.detail.x);
                    console.log(event.detail.y);
                    console.log(event.detail.width);
                    console.log(event.detail.height);
                    console.log(event.detail.rotate);
                    console.log(event.detail.scaleX);
                    console.log(event.detail.scaleY);
                },
            })
            //cropper.replace(imageObject.image)
        })
    } catch(error){
        console.error(error)
    }
}

submitIcon.addEventListener('click', getImage)
//submitIcon.addEventListener('click', goToScroll('button-generate'))





/*Image editor*/
const fileInput = document.querySelector(".file-input"),
filterOptions = document.querySelectorAll(".filter button"),
filterName = document.querySelector(".filter-info .name"),
filterValue = document.querySelector(".filter-info .value"),
filterSlider = document.querySelector(".slider input"),
//rotateOptions = document.querySelectorAll(".rotate button"),
previewImg = document.querySelector(".preview-img img"),
resetFilterBtn = document.querySelector(".reset-filter"),
chooseImgBtn = document.querySelector(".choose-img"),
saveImgBtn = document.querySelector(".save-img");
let brightness = "100", saturation = "100", inversion = "0", grayscale = "0";
let rotate = 0, flipHorizontal = 1, flipVertical = 1;

const loadImage = () => {
    let file = fileInput.files[0];
    if(!file) return;
    previewImg.src = URL.createObjectURL(file);
    previewImg.addEventListener("load", () => {
        resetFilterBtn.click();
        document.querySelector(".container2").classList.remove("disable");
    });
}
const applyFilter = () => {
    //previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
}
filterOptions.forEach(option => {
    option.addEventListener("click", () => {
        document.querySelector(".active").classList.remove("active");
        option.classList.add("active");
        filterName.innerText = option.innerText;
        if(option.id === "brightness") {
            filterSlider.max = "200";
            filterSlider.value = brightness;
            filterValue.innerText = `${brightness}%`;
        } else if(option.id === "saturation") {
            filterSlider.max = "200";
            filterSlider.value = saturation;
            filterValue.innerText = `${saturation}%`
        } else if(option.id === "inversion") {
            filterSlider.max = "100";
            filterSlider.value = inversion;
            filterValue.innerText = `${inversion}%`;
        } else {
            filterSlider.max = "100";
            filterSlider.value = grayscale;
            filterValue.innerText = `${grayscale}%`;
        }
    });
});
const updateFilter = () => {
    filterValue.innerText = `${filterSlider.value}%`;
    const selectedFilter = document.querySelector(".filter .active");
    if(selectedFilter.id === "brightness") {
        brightness = filterSlider.value;
    } else if(selectedFilter.id === "saturation") {
        saturation = filterSlider.value;
    } else if(selectedFilter.id === "inversion") {
        inversion = filterSlider.value;
    } else {
        grayscale = filterSlider.value;
    }
    applyFilter();
}
/*rotateOptions.forEach(option => {
    option.addEventListener("click", () => {
        if(option.id === "left") {
            rotate -= 90;
        } else if(option.id === "right") {
            rotate += 90;
        } else if(option.id === "horizontal") {
            flipHorizontal = flipHorizontal === 1 ? -1 : 1;
        } else {
            flipVertical = flipVertical === 1 ? -1 : 1;
        }
        applyFilter();
    });
});*/
const resetFilter = () => {
    brightness = "100"; saturation = "100"; inversion = "0"; grayscale = "0";
    //rotate = 0; flipHorizontal = 1; flipVertical = 1;
    filterOptions[0].click();
    applyFilter();
}
const saveImage = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = previewImg.naturalWidth;
    canvas.height = previewImg.naturalHeight;
    
    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    if(rotate !== 0) {
        ctx.rotate(rotate * Math.PI / 180);
    }
    ctx.scale(flipHorizontal, flipVertical);
    ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    
    const link = document.createElement("a");
    link.download = "image.jpg";
    link.href = canvas.toDataURL();
    link.click();
}
filterSlider.addEventListener("input", updateFilter);
resetFilterBtn.addEventListener("click", resetFilter);
saveImgBtn.addEventListener("click", saveImage);
fileInput.addEventListener("change", loadImage);
chooseImgBtn.addEventListener("click", () => fileInput.click());




/*
const API_KEY = "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"
const submitIcon = document.querySelector(".button-generate")
const inputElement = document.querySelector("#prompt")

const getImage = async () => {
    const options = {
        method: "POST",
        headers:{
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "prompt": inputElement.value,
            "n": 4,
            "size": "1024x1024"
        })
    }
    try{
        const response = await fetch("https://api.openai.com/v1/images/generations", options)
        const data = await response.json()
        console.log(data)
    } catch(error){
        console.error(error)
    }
}

submitIcon.addEventListener('click', getImage)
*/