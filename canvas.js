const canvasElm = document.getElementById('canvas-game');
const ctx = canvasElm.getContext('2d');

app.canvas = canvasElm;
app.draw = () => {
  canvasElm.width = canvasElm.parentElement.clientWidth;
  canvasElm.height = canvasElm.parentElement.clientHeight;

  const buffer = 50;
  constants.minX = buffer;
  constants.minY = canvasElm.height * 2 / 3;
  constants.maxX = canvasElm.width - buffer;
  constants.maxY = canvasElm.height - buffer;

  ctx.fillStyle = '#404040';
  ctx.fillRect(0, 0, canvasElm.width, canvasElm.height);

  ctx.fillStyle = 'pink';
  const heroSize = buffer/2;
  ctx.beginPath();
  ctx.moveTo(state.heroPosition.x - heroSize, state.heroPosition.y + heroSize);
  ctx.lineTo(state.heroPosition.x, state.heroPosition.y - heroSize);
  ctx.lineTo(state.heroPosition.x + heroSize, state.heroPosition.y + heroSize);
  ctx.closePath();
  ctx.fill();
  if (state.heroBullet){
    ctx.fillRect(state.heroBullet.x - 2, state.heroBullet.y - 5, 4, 10);
  };
}
