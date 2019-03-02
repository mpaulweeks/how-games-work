const canvasElm = document.getElementById('canvas-game');
const ctx = canvasElm.getContext('2d');

app.draw = () => {
  canvasElm.width = canvasElm.parentElement.clientWidth;
  canvasElm.height = canvasElm.parentElement.clientHeight;

  ctx.fillStyle = '#404040';
  ctx.fillRect(0, 0, canvasElm.width, canvasElm.height);

  ctx.fillStyle = 'pink';
  ctx.fillRect(app.state.positionX - 10, app.state.positionY - 10, 20, 20);
}
