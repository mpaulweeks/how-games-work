const canvasElm = document.getElementById('canvas-game');
const ctx = canvasElm.getContext('2d');

app.draw = () => {
  canvasElm.width = canvasElm.parentElement.clientWidth;
  canvasElm.height = canvasElm.parentElement.clientHeight;

  ctx.fillStyle = '#404040';
  ctx.fillRect(0, 0, canvasElm.width, canvasElm.height);

  ctx.fillStyle = 'pink';
  ctx.fillRect(state.heroPosition.x - 10, state.heroPosition.y - 10, 20, 20);
  if (state.heroBullet){
    ctx.fillRect(state.heroBullet.x - 2, state.heroBullet.y - 5, 4, 10);
  };
}
