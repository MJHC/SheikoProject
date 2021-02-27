let angle = 0;
const body = document.body;

function changeAngle(){
  angle = (angle + 5) % 360;
  body.style.background = `linear-gradient(${angle}deg, #00ff6e, #00fff7)`
}

setInterval(changeAngle, 100);