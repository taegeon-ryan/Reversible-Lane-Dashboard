function toggleLED(id) {
  var state = document.getElementById(id);
  if (state.src.match('led-0')) {
    state.src = '/images/led-1.png';
  } else if (state.src.match('led-1')) {
    state.src = '/images/led-2.png';
  } else if (state.src.match('led-2')) {
    state.src = '/images/led-3.png';
  } else {
    state.src = '/images/led-0.png';
  }
}

function toggleLeftLight(id) {
  var parent = document.getElementById(id);
  var light = parent.children[0];
  if (light.className.match('arrow-left')) {
    light.className = 'fas fa-times light-icon';
    light.style = 'color:#e82828';
    test = 0;
  } else {
    light.className = 'fas fa-arrow-left light-icon';
    light.style = 'color:#51cf66';
    test = 1;
  }
}

function toggleRightLight(id) {
  var parent = document.getElementById(id);
  var light = parent.children[0];
  if (light.className.match('arrow-right')) {
    light.className = 'fas fa-times light-icon';
    light.style = 'color:#e82828';
  } else {
    light.className = 'fas fa-arrow-right light-icon';
    light.style = 'color:#51cf66';
  }
}
