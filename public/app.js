var socket = io();
var btn = document.getElementById('pushme');
var quantity = 100,
    fps = 24;

btn.addEventListener('click', function () {
  btn.setAttribute('disabled',true);
  console.log('pushed button');
  socket.emit('btn-push', 'OK');
});

function drinking () {
  // This is the function that controls draining the bottle; at the moment it just runs down automatically from 100%, need to change this to respond to input from socket.
  console.log('drinking');
  var liquid = document.getElementById('liquid');
  (function drain () {
    window.setTimeout(function () {
      if (quantity > 0) {
        window.requestAnimationFrame(drain);
      } else {
        socket.emit('stopped');
      }
      liquid.style.height = quantity + '%';
      quantity--;
    }, 100 / fps);
  })()
}

socket.on('btn-pushed', function () {
  console.log('ready to drink');
  // document.body.classList.toggle('on');
  if (quantity < 100) {
    quantity = 100;
  }
  drinking();
});

socket.on('btn-active', function () {
  btn.removeAttribute('disabled');
});
