function goToScroll(name) {
    var location = document.querySelector("." + name).offsetTop;
    window.scrollTo({top: location, behavior: 'smooth'});
}

// document.addEventListener("DOMContentLoaded", function(){

/*이미지 가져오기*/
const urlStr = window.location.href;
console.log(urlStr)
const url = new URL(urlStr)
const urlParams = url.searchParams;
console.log(urlParams)
const imageUrl = urlParams.get('image_url');
var generatedImage = document.getElementById("generatedImage");

// console.log(getUrlParameter("imageUrl"))
// var imageUrl = decodeURIComponent(getUrlParameter("imageUrl"));
console.log(imageUrl)

// 이미지를 표시
generatedImage.src = imageUrl;

if (imageUrl!=null){    //다른 페이지에서 넘어온 것
    generatedImage.style.display="block"
}


// URL에서 매개변수 값을 추출하는 함수
function getUrlParameter(name) {
    name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

/*이미지 업로드*/
function openFileInput() {
    var imageInput = document.getElementById('imageInput');
    imageInput.click();
  }
  document.getElementById('imageInput').addEventListener('change', function() {
    var imageInput = document.getElementById('imageInput');
    var previewImage = document.getElementById('generatedImage');
    var cropperContainer = document.getElementById('cropperContainer');
  
    if (imageInput.files && imageInput.files[0]) {
        generatedImage.src = URL.createObjectURL(imageInput.files[0])
        cropper.replace(generatedImage.src)
        goToScroll('button');
        generatedImage.style.display="block"
      };
    });

/*framebutton*/
function showPhoneDiv() {
    document.getElementById("phoneframe").style.display = "block";
    document.getElementById("tabletframe").style.display = "none";
    document.getElementById("desktopframe").style.display = "none";
    document.getElementById("watchframe").style.display="none"
  }
  
  function showTabletDiv() {
    document.getElementById("phoneframe").style.display = "none";
    document.getElementById("tabletframe").style.display = "block";
    document.getElementById("desktopframe").style.display = "none";
    document.getElementById("watchframe").style.display="none"
  }

  function showDesktopDiv() {
    document.getElementById("phoneframe").style.display = "none";
    document.getElementById("tabletframe").style.display = "none";
    document.getElementById("desktopframe").style.display = "block";
    document.getElementById("watchframe").style.display="none"
  }
  function showWatchDiv() {
    document.getElementById("phoneframe").style.display = "none";
    document.getElementById("tabletframe").style.display = "none";
    document.getElementById("desktopframe").style.display = "none";
    document.getElementById("watchframe").style.display="block"
  }


/*cropper*/

    const imageInput = document.getElementById("imageInput");
    const createButton = document.getElementById("createButton");
    // const generatedImage = document.getElementById("generatedImage");
    const croppedCanvas = document.getElementById("croppedCanvas");
    const ratioInputs = document.querySelectorAll('input[name="frame-size"]');
    const cropButton = document.getElementById("cropButton")
    const previewImg = document.querySelector(".preview-img img");

    let cropper;

    //generatedImage.src = "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg";
    //generatedImage.src = "https://mk.kakaocdn.net/dna/karlo/image/2023-09-25/0/4efa1d9d-dcf1-424e-b8cb-bfad794f0089.webp?credential=smxRqiqUEJBVgohptvfXS5JoYeFv4Xxa&expires=1695570350&signature=Eg6cTpeE0DINqdAwptmifEOYpuM%3D"

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

    cropButton.addEventListener("click", function() {
        //Crop버튼 클릭 시 크롭된 이미지를 얻어옴
        const croppedImage = cropper.getCroppedCanvas();

        //크롭된 이미지를 화면에 표시하거나 서버에 업로드하거나 다른 작업 수행 가능
        if(croppedImage){
            //크롭된 이미지를 화면에 표시(예: 이미지 요소에 설정)
            const previewImg = document.querySelector(".preview-img img");  //이미지 요소 선택
            previewImg.src = croppedImage.toDataURL(); //크롭된 이미지를 Data URL로 변환해 src에 설정
            goToScroll("button-generate")
            
        }
    });

    //async function generateImage() //Gen AI 모델 호출

    function getSelectedRatio(){
        //선택된 라디오 버튼의 값에 따라 적절한 비율 반환
        var selectedRatioInput = document.querySelector('input[name="frame-size"]:checked');
        return selectedRatioInput.value
    };



/*Image editor*/
const fileInput = document.querySelector(".file-input"),
filterOptions = document.querySelectorAll(".filter button"),
filterName = document.querySelector(".filter-info .name"),
filterValue = document.querySelector(".filter-info .value"),
filterSlider = document.querySelector(".slider input"),
rotateOptions = document.querySelectorAll(".rotate button"),
//previewImg = document.querySelector(".preview-img img"),
resetFilterBtn = document.querySelector(".reset-filter"),
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
rotateOptions.forEach(option => {
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
});
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