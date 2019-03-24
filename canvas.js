const canvasElm = document.getElementById('canvas-game');
const ctx = canvasElm.getContext('2d');

canvasElm.height = canvasElm.parentElement.clientHeight;

app.canvas = canvasElm;
app.draw = () => {
  canvasElm.width = canvasElm.parentElement.clientWidth;

  const { buffer, heroSize, enemySize } = constants;
  Object.assign(constants, {
    canvasWidth: canvasElm.width,
    canvasHeight: canvasElm.height,
    minX: heroSize,
    minY: heroSize,
    maxX: canvasElm.width - heroSize,
    maxY: canvasElm.height - heroSize,
    enemyMinY: buffer,
    enemyMaxY: canvasElm.height / 3,
  });

  ctx.fillStyle = '#101050';
  ctx.fillRect(0, 0, canvasElm.width, canvasElm.height);

  ctx.fillStyle = 'yellow';
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
    ctx.fillRect(enemy.x - enemySize, enemy.y - enemySize, 2*enemySize, 2*enemySize);
    ctx.strokeRect(enemy.x - enemySize, enemy.y - enemySize, 2*enemySize, 2*enemySize);
  });
  state.orbs.forEach(orb => {
    if (!orb.alive){
      return;
    }
    ctx.strokeStyle = orb.color;
    ctx.beginPath();
    ctx.arc(orb.x, orb.y, orb.radius, 0, 2 * Math.PI, false);
    ctx.lineWidth = 4;
    ctx.stroke();
  });

  if (!state.gameOn) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvasElm.width, canvasElm.height);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '40px monospace';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvasElm.width/2, (canvasElm.height / 2) - 50);
    ctx.font = '20px monospace';
    ctx.fillText('press ENTER to start', canvasElm.width/2, (canvasElm.height / 2) + 50);
    ctx.fillText('use ARROW KEYS to move', canvasElm.width/2, (canvasElm.height / 2) + 80);
    ctx.fillText('press SPACE to shoot', canvasElm.width/2, (canvasElm.height / 2) + 110);
  }

  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(canvasElm.width/2 - 75, canvasElm.height - 50, 150, 40);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '16px monospace';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillText('SCORE: ' + state.ticks, canvasElm.width/2, canvasElm.height - 30);
}
