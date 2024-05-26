const classifier = ml5.imageClassifier('MobileNet', modelLoaded);
let modelHasLoaded = false;

function modelLoaded() {
  console.log('Yay, the model has loaded!');
  document.querySelector(".container h1").innerText = "Model loaded. Click capture to take a photo.";
  modelHasLoaded = true;
}

const webcamElement = document.getElementById('webcam');
const captureButton = document.getElementById('capture-btn');
const cameraSelect = document.getElementById('camera-select');
const capturedImageElement = document.getElementById('captured-img');
const resultElement = document.querySelector('.classify-info');

let webcam;

cameraSelect.addEventListener('change', () => {
  if (webcam) {
    webcam.stop();
  }
  startWebcam(cameraSelect.value);
});

function startWebcam(facingMode) {
  webcam = new Webcam(webcamElement, facingMode, webcamElement.width, webcamElement.height);
  webcam.start()
    .then(() => {
      console.log('Webcam started');
    })
    .catch(err => {
      console.error(err);
    });
}

captureButton.addEventListener('click', () => {
  if (modelHasLoaded) {
    const picture = webcam.snap();
    capturedImageElement.src = picture;
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

// Start with the front camera
startWebcam('user');
