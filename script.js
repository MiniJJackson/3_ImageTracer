const classifier = ml5.imageClassifier('MobileNet', modelLoaded);
let modelHasLoaded = false;

function modelLoaded() {
  console.log('Yay, the model has loaded!');
  document.querySelector(".container h1").innerText = "Model loaded. Click capture to take a photo.";
  modelHasLoaded = true;
}

const webcamElement = document.getElementById('webcam');
const captureButton = document.getElementById('capture-btn');
const capturedImageElement = document.getElementById('captured-img');
const resultElement = document.querySelector('.classify-info');

const canvasElement = document.getElementById('canvas');
const snapSoundElement = document.getElementById('snapSound');
const webcam = new Webcam(webcamElement, 'user', canvasElement, snapSoundElement);

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

$('#cameraFlip').click(function() {
    webcam.flip();
    webcam.start();  
});

navigator.mediaDevices.enumerateDevices().then(getVideoInputs).catch(errorCallback);

function getVideoInputs(mediaDevices){
    mediaDevices.forEach(mediaDevice => {
        if (mediaDevice.kind === 'videoinput') {
            this._webcamList.push(mediaDevice);
        }
    });
}

navigator.mediaDevices.getUserMedia(this.getMediaConstraints())
  .then(stream => {
      this._webcamElement.srcObject = stream;
      this._webcamElement.play();
  })
  .catch(error => {
     //...
});

if(this._facingMode == 'user'){
    this._webcamElement.style.transform = "scale(-1,1)";
}

webcam.start()
  .then(() => {
    console.log('Webcam started');
  })
  .catch(err => {
    console.error(err);
  });
