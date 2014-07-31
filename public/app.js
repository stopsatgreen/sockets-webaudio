var socket = io();
var btn = document.getElementById('pushme');
var quantity = 100,
    fps = 24;
//  nowDrinking is a flag for checking if function is running
var nowDrinking = true,
    drinkTimer;

btn.addEventListener('click', function () {
  //  Send message that button has been pushed
  socket.emit('btn-push');
});

function drinking () {
  //  This is the function that controls draining the bottle; at the moment it just runs down automatically from 100%, need to change this to respond to input from socket.
  console.log('drinking');
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

socket.on('btn-pushed', function () {
  //  Reset liquid quantity and run the draining when the button has been pushed
  if (nowDrinking) {
      window.clearTimeout(drinkTimer);
      nowDrinking = false;
  } else {
    if (quantity <= 0) {
      quantity = 100;
    }
    drinking();
  }
});

socket.on('btn-active', function () {
  //  Make the button active again when the draining finishes
  btn.removeAttribute('disabled');
});
