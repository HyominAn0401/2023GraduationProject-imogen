function goToScroll(name) {
    var location = document.querySelector("." + name).offsetTop;
    window.scrollTo({top: location, behavior: 'smooth'});
}
function DropFile(dropAreaId, fileListId) {
    let dropArea = document.getElementById(dropAreaId);
    let fileList = document.getElementById(fileListId);

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight(e) {
        preventDefaults(e);
        dropArea.classList.add("highlight");
    }

    function unhighlight(e) {
        preventDefaults(e);
        dropArea.classList.remove("highlight");
    }

    function handleDrop(e) {
        unhighlight(e);
        let dt = e.dataTransfer;
        let files = dt.files;

        handleFiles(files);

        const fileList = document.getElementById(fileListId);
        if (fileList) {
            fileList.scrollTo({ top: fileList.scrollHeight });
        }
    }

    function handleFiles(files) {
        files = [...files];
        // files.forEach(uploadFile);
        files.forEach(previewFile);
    }

    function previewFile(file) {
        console.log(file);
        renderFile(file);
    }

    function renderFile(file) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function () {
            let img = dropArea.getElementsByClassName("preview")[0];
            img.src = reader.result;
            img.style.display = "block";
        };
    }

    dropArea.addEventListener("dragenter", highlight, false);
    dropArea.addEventListener("dragover", highlight, false);
    dropArea.addEventListener("dragleave", unhighlight, false);
    dropArea.addEventListener("drop", handleDrop, false);

    return {
        handleFiles
    };
}

const dropFile = new DropFile("drop-file", "files");
const dropFile2 = new DropFile("drop-file2", "files2");


/*crop image*/
//import Cropper from 'cropperjs';

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


// /*crop 비율 바꾸기*/
// // 라디오 버튼 클릭시 호출되는 함수
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

// // iphone 14 클릭하면 390x844 비율

// //const cropboxData = cropper.setCropBoxdata({left:0, top:0, width:100, height:100 })

// document.getElementById('cropImageBtn').addEventListener("click",
// function(){
//     var croppedImage = cropper.getCroppedCanvas().toDataURL("image/png");
//     alert(croppedImage);

// })


// /*Karlo API*/
// const REST_API_KEY = "ef7eb4aaf5fdd2c79b127b3a4b6e2309"
// const submitIcon = document.querySelector(".button-generate")
// const inputElement = document.querySelector("#prompt")
// const imageSection = document.querySelector('.image-section')
// const NinputElement = document.querySelector('#negative-prompt')

// const getImage = async () => {
//     const options = {
//         method: "POST",
//         headers:{
//             "Authorization": `KakaoAK ${REST_API_KEY}`,
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//             "prompt": inputElement.value,
//             "negative_prompt": NinputElement.value,
//             "width": 512,
//             //"upascale": true,
//             //"scale": 2,
//             // 객체가 센터에 존재하게객
//             "samples": 1
//         })
//     }
//     try{
//         const response = await fetch("https://api.kakaobrain.com/v2/inference/karlo/t2i", options)
//         const data = await response.json()
//         console.log(response)
//         console.log(data)
//         data?.images.forEach(imageObject => {
//             console.log(imageObject.image)
//             console.log(typeof imageObject.image)
//             // const imageContainer = document.createElement('div')
//             // imageContainer.classList.add('image-container')
//             // const imageElement = document.createElement('img')
//             // imageElement.setAttribute('src', imageObject.image)
//             // imageContainer.append(imageElement)
//             // imageSection.append(imageContainer)
//             cropper.destroy()
//             image.src = imageObject.image
//             cropper = new Cropper(image,{
//                 aspectRatio: 4/3,
//                 dragMode: 'move',
//                 autoCropArea: 0.8,
//                 restore: false,
//                 guides: false,
//                 center: false,
//                 highlight: false,
//                 toggleDragModeOnDblclick: false,

//                 crop(event) {
//                     console.log(event.detail.x);
//                     console.log(event.detail.y);
//                     console.log(event.detail.width);
//                     console.log(event.detail.height);
//                     console.log(event.detail.rotate);
//                     console.log(event.detail.scaleX);
//                     console.log(event.detail.scaleY);
//                 },
//             })
//             //cropper.replace(imageObject.image)
//         })
//     } catch(error){
//         console.error(error)
//     }
// }

// submitIcon.addEventListener('click', getImage)
// //submitIcon.addEventListener('click', goToScroll('button-generate'))





// /*Image editor*/
// const fileInput = document.querySelector(".file-input"),
// filterOptions = document.querySelectorAll(".filter button"),
// filterName = document.querySelector(".filter-info .name"),
// filterValue = document.querySelector(".filter-info .value"),
// filterSlider = document.querySelector(".slider input"),
// //rotateOptions = document.querySelectorAll(".rotate button"),
// previewImg = document.querySelector(".preview-img img"),
// resetFilterBtn = document.querySelector(".reset-filter"),
// chooseImgBtn = document.querySelector(".choose-img"),
// saveImgBtn = document.querySelector(".save-img");
// let brightness = "100", saturation = "100", inversion = "0", grayscale = "0";
// let rotate = 0, flipHorizontal = 1, flipVertical = 1;
// const loadImage = () => {
//     let file = fileInput.files[0];
//     if(!file) return;
//     previewImg.src = URL.createObjectURL(file);
//     previewImg.addEventListener("load", () => {
//         resetFilterBtn.click();
//         document.querySelector(".container2").classList.remove("disable");
//     });
// }
// const applyFilter = () => {
//     //previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
//     previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
// }
// filterOptions.forEach(option => {
//     option.addEventListener("click", () => {
//         document.querySelector(".active").classList.remove("active");
//         option.classList.add("active");
//         filterName.innerText = option.innerText;
//         if(option.id === "brightness") {
//             filterSlider.max = "200";
//             filterSlider.value = brightness;
//             filterValue.innerText = `${brightness}%`;
//         } else if(option.id === "saturation") {
//             filterSlider.max = "200";
//             filterSlider.value = saturation;
//             filterValue.innerText = `${saturation}%`
//         } else if(option.id === "inversion") {
//             filterSlider.max = "100";
//             filterSlider.value = inversion;
//             filterValue.innerText = `${inversion}%`;
//         } else {
//             filterSlider.max = "100";
//             filterSlider.value = grayscale;
//             filterValue.innerText = `${grayscale}%`;
//         }
//     });
// });
// const updateFilter = () => {
//     filterValue.innerText = `${filterSlider.value}%`;
//     const selectedFilter = document.querySelector(".filter .active");
//     if(selectedFilter.id === "brightness") {
//         brightness = filterSlider.value;
//     } else if(selectedFilter.id === "saturation") {
//         saturation = filterSlider.value;
//     } else if(selectedFilter.id === "inversion") {
//         inversion = filterSlider.value;
//     } else {
//         grayscale = filterSlider.value;
//     }
//     applyFilter();
// }
// /*rotateOptions.forEach(option => {
//     option.addEventListener("click", () => {
//         if(option.id === "left") {
//             rotate -= 90;
//         } else if(option.id === "right") {
//             rotate += 90;
//         } else if(option.id === "horizontal") {
//             flipHorizontal = flipHorizontal === 1 ? -1 : 1;
//         } else {
//             flipVertical = flipVertical === 1 ? -1 : 1;
//         }
//         applyFilter();
//     });
// });*/
// const resetFilter = () => {
//     brightness = "100"; saturation = "100"; inversion = "0"; grayscale = "0";
//     //rotate = 0; flipHorizontal = 1; flipVertical = 1;
//     filterOptions[0].click();
//     applyFilter();
// }
// const saveImage = () => {
//     const canvas = document.createElement("canvas");
//     const ctx = canvas.getContext("2d");
//     canvas.width = previewImg.naturalWidth;
//     canvas.height = previewImg.naturalHeight;
    
//     ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
//     ctx.translate(canvas.width / 2, canvas.height / 2);
//     if(rotate !== 0) {
//         ctx.rotate(rotate * Math.PI / 180);
//     }
//     ctx.scale(flipHorizontal, flipVertical);
//     ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    
//     const link = document.createElement("a");
//     link.download = "image.jpg";
//     link.href = canvas.toDataURL();
//     link.click();
// }
// filterSlider.addEventListener("input", updateFilter);
// resetFilterBtn.addEventListener("click", resetFilter);
// saveImgBtn.addEventListener("click", saveImage);
// fileInput.addEventListener("change", loadImage);
// chooseImgBtn.addEventListener("click", () => fileInput.click());


// /*crop 비율 바꾸기*/
// // 라디오 버튼 클릭시 호출되는 함수
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
// /


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


/* sample image choose*/
// function selectContentImage(sampleImage) {
//     document.getElementById('content-selected-image').value = sampleImage;
// }
// function selectStyleImage(sampleImage) {
//     document.getElementById('style-selected-image').value = sampleImage;
// }


//var selectedContentImageType = document.querySelector('input[name="content-image"]:checked').value;
//var selectedStyleImageType = document.querySelector('input[name="style-image"]:checked').value;
var uploadedContentImage = document.getElementById("chooseFile")
var uploadedStyleImage = document.getElementById("chooseFile2")
var RadioInputContentImage = document.getElementById("content_selected_image")
var RadioInputStyleImage = document.getElementById("style_selected_image")


//content-radio버튼 선택시
document.querySelectorAll('input[name="image-card"]').forEach(function(radio) {
    radio.addEventListener("change", function() {
        uploadedContentImage.value = "";
        console.log(uploadedContentImage.value)
        RadioInputContentImage.value = document.querySelector('input[name="image-card"]:checked').value;
        console.log(RadioInputContentImage.value)
    });
});

//style-radio버튼 선택시
document.querySelectorAll('input[name="image-card2"]').forEach(function(radio) {
    radio.addEventListener("change", function() {
        uploadedStyleImage.value = "";
        console.log(uploadedStyleImage.value)
        RadioInputStyleImage.value = document.querySelector('input[name="image-card2"]:checked').value;
        console.log(RadioInputStyleImage.value)
    });
});

uploadedContentImage.addEventListener("change", function () {
    // Uncheck radio buttons
    document.querySelectorAll('input[name="image-card"]').forEach(function(radio) {
        radio.checked = false;
    });
    if (RadioInputContentImage.value){
        RadioInputContentImage.value = "";
        console.log(RadioInputContentImage.value)
    }
    console.log(uploadedContentImage.value)
});

uploadedStyleImage.addEventListener("change", function () {
    // Uncheck radio buttons
    document.querySelectorAll('input[name="image-card2"]').forEach(function(radio) {
        radio.checked = false;
    });
    if (RadioInputStyleImage.value){
        RadioInputStyleImage.value = "";
        console.log(RadioInputStyleImage.value)
    }
    console.log(uploadedStyleImage.value)
});


/* 다운로드 버튼 */
// 이미지 생성 여부 확인을 위한 함수
function checkImageGeneration() {
    // 서버에 AJAX 요청을 보냄
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/check_image_generation_endpoint', true);   //서버의 엔드포인트...뭔지 모르겠음.
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // 이미지가 생성되었는지 확인
            var response = JSON.parse(xhr.responseText);
            if (response.imageGenerated) {
                // 이미지가 생성되었다면 이미지 표시
                //document.getElementById("resultImage").src = response.imageUrl;
                
                // 다운로드 버튼 표시
                document.getElementById("downloadButton").style.display = "block";
            }
        }
    };
    xhr.send();
}

// 일정한 간격으로 이미지 생성 여부 확인
setInterval(checkImageGeneration, 3000); // 3초마다 확인