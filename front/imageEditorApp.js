function goToScroll(name) {
    var location = document.querySelector("." + name).offsetTop;
    window.scrollTo({top: location, behavior: 'smooth'});
}


/*Cropper*/

/*crop image*/
//const imageInput = document.getElementById("imageInput");
//const createButton = document.getElementById("createButton");
const generatedImage = document.getElementById("generatedImage");
//const croppedCanvas = document.getElementById("croppedCanvas");
const ratioInputs = document.querySelectorAll('input[name="frame-size"]');
const cropButton = document.getElementById("cropButton");
const previewImg = document.querySelector(".preview-img img");
const resetFilterBtn = document.querySelector(".reset-filter");

const REST_API_KEY = config.apikey;
const submitIcon = document.getElementById("text2imgBtn");
const inputElement = document.querySelector("#prompt");
//const imageSection = document.querySelector('.image-section');
const NinputElement = document.querySelector('#negative-prompt');

let cropper;

const getImage = async () => {
    const options = {
        method: "POST",
        headers:{
            "Authorization": `KakaoAK ${REST_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "prompt": inputElement.value,
            "negative_prompt": NinputElement.value,
            "width": 512,
            "samples": 1,
            "upscale": true,
            "scale": 4
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
            const generatedImageUrl = imageObject.image;

            fetch(generatedImageUrl)
              .then(response => response.blob())
              .then(blob => {
                const url = URL.createObjectURL(blob);

                // 이미지를 Cropper.js에 전달
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
              })
              .catch(error => console.error(error));
            })
            // const imageContainer = document.createElement('div')
            // imageContainer.classList.add('image-container')
            // const imageElement = document.createElement('img')
            // imageElement.setAttribute('src', imageObject.image)
            // imageContainer.append(imageElement)
            // imageSection.append(imageContainer)
        // 라디오 버튼의 변경 이벤트 핸들러를 추가
        ratioInputs.forEach(function(input){
            input.addEventListener("change", function(){
                const selectedRatio = getSelectedRatio();
                let words = selectedRatio.split('x');
                var w = Number(words[0]);
                var h = Number(words[1]);
                cropper.setAspectRatio(w/h);
            });
        });
    } catch(error){
        console.error(error);
    }
};

submitIcon.addEventListener('click', getImage);

function getSelectedRatio(){
    // 선택된 라디오 버튼의 값에 따라 적절한 비율 반환
    var selectedRatioInput = document.querySelector('input[name="frame-size"]:checked');
    return selectedRatioInput.value;

}

cropButton.addEventListener("click", function() {
    //Crop버튼 클릭 시 크롭된 이미지를 얻어옴
    const croppedImage = cropper.getCroppedCanvas();

    //크롭된 이미지를 화면에 표시하거나 서버에 업로드하거나 다른 작업 수행 가능
    if(croppedImage){
        //크롭된 이미지를 화면에 표시(예: 이미지 요소에 설정)
        previewImg.src = croppedImage.toDataURL(); //크롭된 이미지를 Data URL로 변환해 src에 설정
        resetFilterBtn.click();
        document.querySelector(".container2").classList.remove("disable");
    }
});










/*Image editor*/
const fileInput = document.querySelector(".file-input"),
filterOptions = document.querySelectorAll(".filter button"),
filterName = document.querySelector(".filter-info .name"),
filterValue = document.querySelector(".filter-info .value"),
filterSlider = document.querySelector(".slider input"),
//rotateOptions = document.querySelectorAll(".rotate button"),
//previewImg = document.querySelector(".preview-img img"),
//resetFilterBtn = document.querySelector(".reset-filter"),
chooseImgBtn = document.querySelector(".choose-img"),
saveImgBtn = document.querySelector(".save-img");
let brightness = "100", saturation = "100", inversion = "0", grayscale = "0";
let rotate = 0, flipHorizontal = 1, flipVertical = 1;

// const loadImage = () => {
//     let file = fileInput.files[0];
//     if(!file) return;
//     previewImg.src = URL.createObjectURL(file);
//     previewImg.addEventListener("load", () => {
//         resetFilterBtn.click();
//         document.querySelector(".container2").classList.remove("disable");
//     });
// }





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
//fileInput.addEventListener("change", loadImage);
//chooseImgBtn.addEventListener("click", () => fileInput.click());

