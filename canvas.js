const canvasElm = document.getElementById('canvas-game');
const ctx = canvasElm.getContext('2d');

app.canvas = canvasElm;
app.draw = () => {
  canvasElm.width = canvasElm.parentElement.clientWidth;
  canvasElm.height = canvasElm.parentElement.clientHeight;

  const buffer = 50;
  Object.assign(constants, {
    canvasWidth: canvasElm.width,
    canvasHeight: canvasElm.height,
    minX: buffer,
    minY: canvasElm.height * 2 / 3,
    maxX: canvasElm.width - buffer,
    maxY: canvasElm.height - buffer,
    enemySpawnX: canvasElm.width + buffer,
    enemySpawnY: buffer,
    enemyMinY: buffer,
    enemyMaxY: canvasElm.height / 3,
  });

  ctx.fillStyle = '#101010';
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

  ctx.strokeStyle = '#FFFFFF';
  state.enemies.forEach(enemy => {
    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x - heroSize, enemy.y - heroSize, 2*heroSize, 2*heroSize);
    ctx.strokeRect(enemy.x - heroSize, enemy.y - heroSize, 2*heroSize, 2*heroSize);
  });
  state.enemyBullets.forEach(eb => {
    ctx.strokeStyle = eb.color;
    ctx.beginPath();
    ctx.arc(eb.x, eb.y, 8, 0, 2 * Math.PI, false);
    ctx.lineWidth = 4;
    ctx.stroke();
  });
}
