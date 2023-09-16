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
        //uploadedContentImage.files = null;
        console.log(uploadedContentImage.value)
        RadioInputContentImage.value = document.querySelector('input[name="content-image"]:checked').value;
        console.log(RadioInputContentImage.value)
        document.getElementById('preview1').src = RadioInputContentImage.src
    });
});

//style-radio버튼 선택시
document.querySelectorAll('input[name="style-image"]').forEach(function(radio) {
    radio.addEventListener("change", function() {
        uploadedStyleImage.value = null;
        //uploadedStyleImage.files = null;
        console.log(uploadedStyleImage.value)
        RadioInputStyleImage.value = document.querySelector('input[name="style-image"]:checked').value;
    });
});

uploadedContentImage.addEventListener("change", function () {
    // Uncheck radio buttons
    document.querySelectorAll('input[name="content-image"]').forEach(function(radio) {
        radio.checked = false;
    });
    console.log(uploadedContentImage.value)
    if (RadioInputContentImage.value){
        RadioInputContentImage.value = "";
        console.log(RadioInputContentImage.value)

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