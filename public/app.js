var socket = io();
var btn = document.getElementById('pushme');
var quantity = 100,
    fps = 24;
//  nowDrinking is a flag for checking if the drinking function is running
var nowDrinking = true,
    drinkTimer;

var meter = null;

//  nowDrinking is a flag for checking if function is running
var nowDrinking = true,
    drinkTimer;

btn.addEventListener('click', function () {
//  Send message that button has been pushed
  socket.emit('btn-push');
});


//run mobile functions
if ( isMobile.any ){
    webRTCCheck();
    initAudio();
}
//desktop only
else{
}

function initAudio(){
  //grab the audio via RTC
  if( navigator.getUserMedia ){
    navigator.getUserMedia ({ audio: true, video: false }, getAudio, function(){} );
  }
}

function webRTCCheck(){
    //Check if getUserMedia, requestAnimationFrame, and AudioContext are supported by browser
    window.requestAnimFrame = ( function(){ return  window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame })();
    navigator.getUserMedia = ( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
}

function getAudio(stream){
    //create object for accessing audio
    var audioContext = new AudioContext();
    var mediaStreamSource = audioContext.createMediaStreamSource(stream);
    meter = createAudioMeter(audioContext);
    mediaStreamSource.connect(meter);
    audioInputUpdate();
}

function audioInputUpdate(){
//Loop for new audio input
  var volume = Math.floor(meter.volume*1000);
  socket.emit('audio-update', volume);
  requestAnimFrame(audioInputUpdate);
}

function drinking () {
//  This is the function that controls draining the bottle; at the moment it just runs down automatically from 100%, need to change this to respond to input from socket.
  var liquid = document.getElementById('liquid'),
      gulp;
  nowDrinking = true;
  (function drain () {
    drinkTimer = window.setTimeout(function () {
      if (quantity > 0) {
        window.requestAnimationFrame(drain);
      } else {
        socket.emit('stopped');
      }
      gulp = quantity % 15 === 0;
      if (gulp) {
        liquid.style.height = quantity + '%';
      }
      quantity--;
    }, 1000 / fps);
  })()
}

socket.on('audio-new-value', function (volume) {
  var volumeAmount = document.getElementById('volume-amount');
  volumeAmount.innerHTML = volume;
  if (volume > 150 && nowDrinking === false) {
    if (quantity <= 0) {
      quantity = 100;
    }
    drinking();
  } else if (volume < 50 && nowDrinking) {
    window.clearTimeout(drinkTimer);
    nowDrinking = false;
  }
//  Reset liquid quantity and run the draining when the button has been pushed
});

socket.on('btn-active', function () {
//  Do something(?) when the draining finishes
});
