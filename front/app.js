/**
 * get started button  누르면 아래로 스크롤 되는 함수
 * @param {any} name
 */
function goToScroll(name) {
    var location = document.querySelector("." + name).offsetTop;
    window.scrollTo({top: location, behavior: 'smooth'});
}

///*crop image*/
////import Cropper from 'cropperjs';

//var image = document.getElementById('image');
//const cropper = new Cropper(image, {
////   aspectRatio: 3/4,
////   viewMode:0,
//  dragMode: 'move',
//  aspectRatio: 3/4,
//  autoCropArea: 0.8,
//  restore: false,
//  guides: false,
//  center: false,
//  highlight: false,
//  //zoomable: false,
////   cropBoxMovable: false,
////   cropBoxResizable: false,
//  toggleDragModeOnDblclick: false,

//  crop(event) {
//    console.log(event.detail.x);
//    console.log(event.detail.y);
//    console.log(event.detail.width);
//    console.log(event.detail.height);
//    console.log(event.detail.rotate);
//    console.log(event.detail.scaleX);
//    console.log(event.detail.scaleY);
//  },

//});


/*crop 비율 바꾸기*/
// 라디오 버튼 클릭시 호출되는 함수
var w;  // 가로 비율
var h;  // 세로비율
function changeRatio(){
    
    var options = document.getElementsByName("frame-size");
    console.log(options[0].value)

    for (var i = 0; i < options.length; i++) {
        if (options[i].checked) {
            // 선택된 라디오 버튼의 값을 가져와서 표시
            let words = options[i].value.split('x');
            console.log(words[0]);
            console.log(words[1]);
            w = Number(words[0]);
            h = Number(words[1]);
            console.log(typeof Number(words[0]));
            console.log(typeof Number(words[1]));
            cropper.setAspectRatio(w/h)
            break;
        }
    }

}
// 라디오 버튼 클릭 이벤트에 함수 연결
var radioButtons = document.getElementsByName("frame-size");
for (var i = 0; i < radioButtons.length; i++) {
    radioButtons[i].addEventListener("click", changeRatio);
}

// iphone 14 클릭하면 390x844 비율

//const cropboxData = cropper.setCropBoxdata({left:0, top:0, width:100, height:100 })

document.getElementById('cropImageBtn').addEventListener("click",
function(){
    var croppedImage = cropper.getCroppedCanvas().toDataURL("image/png");
    alert(croppedImage);

})


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


/*draw canvas*/
let canvas = document.getElementById('drawingCanvas');
let ctx = canvas.getContext('2d');
let drawing = false;
var sketch_file;

canvas.addEventListener('mousedown', (event) => {
    drawing = true;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    ctx.moveTo(x, y);
});

canvas.addEventListener('mouseup', () => {
    drawing = false;
    ctx.beginPath();
});

canvas.addEventListener('mousemove', (event) => {
    if (!drawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black';

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
});

// Generate JPEG image from the canvas
function saveImagetoJpg() {
    let dataURL = canvas.toDataURL('image/jpeg'); // Convert canvas content to JPEG
    let imageElement = document.getElementById('image');
    imageElement.src = dataURL;
    console.log(imageElement.src)
    sketch_file=imageElement.src
}

document.getElementById('sk2img-generate').addEventListener('click', saveImagetoJpg);













/* sketch2image api */
// app.js

const API_URL =' https://clipdrop-api.co/sketch-to-image/v1/sketch-to-image';
const API_KEY = '411f71385cad312ce1772dc4b37c377c794a8da4352b904c0459318f2c75ecae19a8c9b48e329d1b5a5c976162add4d1';

const generateImage = async () => {
    let canvasData = canvas.toDataURL();
    let blob = await fetch(canvasData).then(res => res.blob());

    let formData = new FormData();
    formData.append('sketch_file', blob, 'sketch.png');

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'x-api-key': API_KEY,
            },
            body: formData
        });

        if (response.status === 200) {
            const imageBlob = await response.blob();
            const imageUrl = URL.createObjectURL(imageBlob);
            document.getElementById('image').src = imageUrl;
        } else {
            console.error('Error:', response.status, response.statusText);
            const errorData = await response.json();
            console.error('Error details:', errorData.error);
        }

    } catch (error) {
        console.error('API call failed:', error);
    }
};

document.getElementById('sk2img-generate').addEventListener('click', generateImage);







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


/*crop 비율 바꾸기*/
// 라디오 버튼 클릭시 호출되는 함수
var w;  // 가로 비율
var h;  // 세로비율
function changeRatio(){
    
    var options = document.getElementsByName("frame-size");
    console.log(options[0].value)

    for (var i = 0; i < options.length; i++) {
        if (options[i].checked) {
            // 선택된 라디오 버튼의 값을 가져와서 표시
            let words = options[i].value.split('x');
            console.log(words[0]);
            console.log(words[1]);
            w = Number(words[0]);
            h = Number(words[1]);
            console.log(typeof Number(words[0]));
            console.log(typeof Number(words[1]));
            cropper.setAspectRatio(w/h)
            break;
        }
    }

}
// 라디오 버튼 클릭 이벤트에 함수 연결
var radioButtons = document.getElementsByName("frame-size");
for (var i = 0; i < radioButtons.length; i++) {
    radioButtons[i].addEventListener("click", changeRatio);
}



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



