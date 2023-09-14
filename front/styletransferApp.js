function goToScroll(name) {
    var location = document.querySelector("." + name).offsetTop;
    window.scrollTo({top: location, behavior: 'smooth'});
}




//var selectedContentImageType = document.querySelector('input[name="content-image"]:checked').value;
//var selectedStyleImageType = document.querySelector('input[name="style-image"]:checked').value;
var uploadedContentImage = document.getElementById("chooseFile")
var uploadedStyleImage = document.getElementById("chooseFile2")
var RadioInputContentImage = document.getElementById("contentRadioInput")
var RadioInputStyleImage = document.getElementById("styleRadioInput")


//content-radio버튼 선택시
document.querySelectorAll('input[name="content-image"]').forEach(function(radio) {
    radio.addEventListener("change", function() {
        uploadedContentImage.value = null;
        console.log(uploadedContentImage.files[0])
        RadioInputContentImage.value = document.querySelector('input[name="content-image"]:checked').value;
    });
});

//style-radio버튼 선택시
document.querySelectorAll('input[name="style-image"]').forEach(function(radio) {
    radio.addEventListener("change", function() {
        uploadedStyleImage.value = null;
        console.log(uploadedStyleImage.files[0])
        RadioInputStyleImage.value = document.querySelector('input[name="style-image"]:checked').value;
    });
});

uploadedContentImage.addEventListener("change", function () {
    // Uncheck radio buttons
    document.querySelectorAll('input[name="content-image"]').forEach(function(radio) {
        radio.checked = false;
    });
    if (RadioInputContentImage.value){
        RadioInputContentImage.value = null;
    }
});

uploadedStyleImage.addEventListener("change", function () {
    // Uncheck radio buttons
    document.querySelectorAll('input[name="style-image"]').forEach(function(radio) {
        radio.checked = false;
    });
    if (RadioInputStyleImage.value){
        RadioInputStyleImage.value = null;
    }
});