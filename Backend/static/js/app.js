function goToScroll(name) {
    var location = document.querySelector("." + name).offsetTop;
    window.scrollTo({top: location, behavior: 'smooth'});
}
// function DropFile(dropAreaId, fileListId) {
//     let dropArea = document.getElementById(dropAreaId);
//     let fileList = document.getElementById(fileListId);

//     function preventDefaults(e) {
//         e.preventDefault();
//         e.stopPropagation();
//     }

//     function highlight(e) {
//         preventDefaults(e);
//         dropArea.classList.add("highlight");
//     }

//     function unhighlight(e) {
//         preventDefaults(e);
//         dropArea.classList.remove("highlight");
//     }

//     function handleDrop(e) {
//         unhighlight(e);
//         let dt = e.dataTransfer;
//         let files = dt.files;

//         handleFiles(files);

//         const fileList = document.getElementById(fileListId);
//         if (fileList) {
//             fileList.scrollTo({ top: fileList.scrollHeight });
//         }
//     }

//     function handleFiles(files) {
//         files = [...files];
//         // files.forEach(uploadFile);
//         files.forEach(previewFile);
//     }

//     function previewFile(file) {
//         console.log(file);
//         renderFile(file);
//     }

//     function renderFile(file) {
//         let reader = new FileReader();
//         reader.readAsDataURL(file);
//         reader.onloadend = function () {
//             let img = dropArea.getElementsByClassName("preview")[0];
//             img.src = reader.result;
//             img.style.display = "block";
//         };
//     }

//     dropArea.addEventListener("dragenter", highlight, false);
//     dropArea.addEventListener("dragover", highlight, false);
//     dropArea.addEventListener("dragleave", unhighlight, false);
//     dropArea.addEventListener("drop", handleDrop, false);

//     return {
//         handleFiles
//     };
// }

// const dropFile = new DropFile("drop-file", "files");
// const dropFile2 = new DropFile("drop-file2", "files2");

// //var selectedContentImageType = document.querySelector('input[name="content-image"]:checked').value;
// //var selectedStyleImageType = document.querySelector('input[name="style-image"]:checked').value;
// var uploadedContentImage = document.getElementById("chooseFile")
// var uploadedStyleImage = document.getElementById("chooseFile2")
// var RadioInputContentImage = document.getElementById("content_selected_image")
// var RadioInputStyleImage = document.getElementById("style_selected_image")


// //content-radio버튼 선택시
// document.querySelectorAll('input[name="image-card"]').forEach(function(radio) {
//     radio.addEventListener("change", function() {
//         uploadedContentImage.value = "";
//         console.log(uploadedContentImage.value)
//         RadioInputContentImage.value = document.querySelector('input[name="image-card"]:checked').value;
//         console.log(RadioInputContentImage.value)
//         document.getElementById('dropboxImage1').src="{% static 'img/thum_s_01.jpeg' %}"
//     });
// });

// //style-radio버튼 선택시
// document.querySelectorAll('input[name="image-card2"]').forEach(function(radio) {
//     radio.addEventListener("change", function() {
//         uploadedStyleImage.value = "";
//         console.log(uploadedStyleImage.value)
//         RadioInputStyleImage.value = document.querySelector('input[name="image-card2"]:checked').value;
//         console.log(RadioInputStyleImage.value)
//     });
// });

// uploadedContentImage.addEventListener("change", function () {
//     // Uncheck radio buttons
//     document.querySelectorAll('input[name="image-card"]').forEach(function(radio) {
//         radio.checked = false;
//     });
//     if (RadioInputContentImage.value){
//         RadioInputContentImage.value = "";
//         console.log(RadioInputContentImage.value)
//     }
//     console.log(uploadedContentImage.value)
// });

// uploadedStyleImage.addEventListener("change", function () {
//     // Uncheck radio buttons
//     document.querySelectorAll('input[name="image-card2"]').forEach(function(radio) {
//         radio.checked = false;
//     });
//     if (RadioInputStyleImage.value){
//         RadioInputStyleImage.value = "";
//         console.log(RadioInputStyleImage.value)
//     }
//     console.log(uploadedStyleImage.value)
// });

var generated_image_path

// /* 다운로드 버튼 */
// // 이미지 생성 여부 확인을 위한 함수
// function checkImageGeneration() {
//     // 서버에 AJAX 요청을 보냄
//     var xhr = new XMLHttpRequest();
//     xhr.open('GET', '/check_image_generation_endpoint', true);   //서버의 엔드포인트...뭔지 모르겠음.
//     xhr.onreadystatechange = function () {
//         if (xhr.readyState === 4 && xhr.status === 200) {
//             // 이미지가 생성되었는지 확인
//             var response = JSON.parse(xhr.responseText);
//             if (response.imageGenerated) {
//                 // 이미지가 생성되었다면 이미지 표시
//                 //document.getElementById("resultImage").src = response.imageUrl;
                
//                 // 다운로드 버튼 표시
//                 document.getElementById("downloadButton").style.display = "block";
//             }
//         }
//     };
//     xhr.send();
// }

// 일정한 간격으로 이미지 생성 여부 확인
// setInterval(checkImageGeneration, 3000); // 3초마다 확인

//generate image 생성시
function imageLoaded(){
    document.getElementById("buttons").style.display="flex";
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

// 팝업 토글
document.getElementById("toggleButton").addEventListener("click", function() {
    togglePopup(popup.popupId);
});


/*Edit Image 버튼 - ImageEditor 창으로 보내기*/


document.getElementById("imageEditButton").addEventListener("click", function() {
    // 이미지 URL을 가져와서 imageEditor.html 페이지로 전달
    console.log("click")
    console.log("{{ generated_image_model.generated_image.url }}")
    console.log(document.getElementById('result-image').src)
    var imageUrl = document.getElementById('result-image').src; // 이미지 URL을 여기에 적용
    // window.location.href = "imageEditor.html?imageUrl=" + encodeURIComponent(imageUrl);
    window.location.href ="http://127.0.0.1:8000/styletransfer/imageEdit?image_url=" + encodeURIComponent(imageUrl);
});

