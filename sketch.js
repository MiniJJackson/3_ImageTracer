// Initialize the webcam and capture button
const webcamElement = document.getElementById('webcam');
const photoElement = document.getElementById('photo');
const captureButton = document.getElementById('capture');
const resultElement = document.getElementById('result');

// Create an instance of WebcamEasy
const webcam = new Webcam(webcamElement, 'user');

// Load MobileNet model
let net;
async function loadModel() {
    net = await mobilenet.load();
    console.log('MobileNet model loaded');
}


// Start the webcam and load the model
webcam.start()
    .then(result => {
        console.log('Webcam started');
    })
    .catch(err => {
        console.error(err);
    });

loadModel();
