let net;
const captureButton = document.getElementById('capture-btn');
const capturedImageElement = document.getElementById('captured-img');
const resultElement = document.querySelector('.classify-info');


const webcamElement = document.getElementById('webcam');
const canvasElement = document.getElementById('canvas');
const snapSoundElement = document.getElementById('snapSound');
const webcam = new Webcam(webcamElement, 'user', canvasElement, snapSoundElement);

async function setup() {
  console.log('Loading MobileNet model...');
  net = await mobilenet.load();
  console.log('Model loaded.');
  document.querySelector("h1").innerText = "Model loaded. Click capture to take a photo.";
}

captureButton.addEventListener('click', async () => {
  const picture = webcam.snap();
  capturedImageElement.src = picture;
  resultElement.innerHTML = '<h2>Classifying...</h2>';
  const img = new Image();
  img.src = picture;
  img.onload = async () => {
    const predictions = await net.classify(img);
    displayPredictions(predictions);
  };
});

function displayPredictions(predictions) {
  resultElement.innerHTML = '';
  predictions.forEach(prediction => {
    const p = document.createElement('p');
    p.innerText = `${prediction.className}: ${(prediction.probability * 100).toFixed(2)}%`;
    resultElement.appendChild(p);
  });
}

webcam.start()
  .then(result => {
    console.log('Webcam started');
    setup();
  })
  .catch(err => {
    console.error(err);
  });
