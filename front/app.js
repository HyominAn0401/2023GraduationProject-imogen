/*
 * get started button  누르면 아래로 스크롤 되는 함수
 * @param {any} name
 */
function goToScroll(name) {
    var location = document.querySelector("." + name).offsetTop;
    window.scrollTo({top: location, behavior: 'smooth'});
}

const saveButton = document.querySelector('.save-img');
//const resultImage = document.getElementById('result-image');

// saveButton.addEventListener('click', function() {
//     // Create an anchor element
//     const a = document.createElement('a')
//     a.download = 'downloaded_image.png'; // Set the file name for download
//     a.href = resultImage.src; // Set the image source as the URL
//     a.click();

//     // const link = document.createElement("a");
//     // link.download = "image.jpg";
//     // link.href = canvas.toDataURL();
//     // link.click();

//     // Trigger a click event on the anchor element
//     // const event = new MouseEvent('click', {
//     //     view: window,
//     //     bubbles: true,
//     //     cancelable: true
//     // });
//     // a.dispatchEvent(event);
// });

const shareButton = document.querySelector('.share-img');
const resultImage = document.getElementById('result-img');

shareButton.addEventListener('click', function() {
    // Prompt the user to enter an email address
    const email = prompt('Enter recipient email address:');
    if (!email) return; // Exit if no email is provided
});