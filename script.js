const classifier = ml5.imageClassifier('MobileNet', modelLoaded);
let modelHasLoaded = false;

function modelLoaded() {
  console.log('Yay, the model has loaded!');
  document.querySelector(".container h1").innerText = "Model loaded. Click capture to take a photo.";
  modelHasLoaded = true;
}

const webcamElement = document.getElementById('webcam');
const captureButton = document.getElementById('capture-btn');
const toggleCameraButton = document.getElementById('toggle-camera-btn');
const flipCameraButton = document.getElementById('cameraFlip');
const capturedImageElement = document.getElementById('captured-img');
const resultElement = document.querySelector('.classify-info');
const downloadLink = document.getElementById('download-photo');

const canvasElement = document.getElementById('canvas');
const snapSoundElement = document.getElementById('snapSound');
let currentFacingMode = 'user'; // Start with the front camera

let webcam = new Webcam(webcamElement, currentFacingMode, canvasElement, snapSoundElement);

captureButton.addEventListener('click', () => {
  if (modelHasLoaded) {
    let picture = webcam.snap();
    snapSoundElement.play(); // Play the snap sound
    capturedImageElement.src = picture;
    downloadLink.href = picture; // Set the href attribute for download
    resultElement.innerHTML = '<h2>Classifying...</h2>';
    const img = new Image();
    img.src = picture;
    img.onload = () => {
      classifier.classify(img, (err, results) => {
        if (err) {
          console.error(err);
          return;
        }
        displayPredictions(results);
      });
    };
  }
});

toggleCameraButton.addEventListener('click', () => {
  currentFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
  webcam.stop();
  webcam = new Webcam(webcamElement, currentFacingMode, canvasElement, snapSoundElement);
  webcam.start()
    .then(() => {
      console.log(`Camera switched to ${currentFacingMode}`);
    })
    .catch(err => {
      console.error(err);
    });
});


$('#cameraFlip').click(function() {
  webcam.flip();
  webcam.start();
});

function displayPredictions(predictions) {
  resultElement.innerHTML = '';
  for (let result of predictions) {
    console.log(result);
    if (result.confidence >= 0.1) {
      resultElement.innerHTML += `<h2>${result.label}: ${(result.confidence * 100).toFixed(2)}%</h2>`;
    }
  }
  if (resultElement.innerHTML === '') {
    resultElement.innerHTML = '<h2>No result found</h2>';
  }
}

webcam.start()
  .then(() => {
    console.log('Webcam started');
  })
  .catch(err => {
    console.error(err);
  });
