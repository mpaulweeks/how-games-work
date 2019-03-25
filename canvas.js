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
    minX: heroSize * 2,
    maxX: canvasElm.width - (heroSize * 2),
    enemyMinY: buffer,
    enemyMaxY: canvasElm.height / 3,
  });

  ctx.fillStyle = '#101050';
  ctx.fillRect(0, 0, canvasElm.width, canvasElm.height);

  ctx.fillStyle = 'yellow';
  ctx.strokeStyle = 'yellow';

  // draw hero base
  ctx.beginPath();
  ctx.arc(state.shooterBase.x, state.shooterBase.y, heroSize, Math.PI, 2*Math.PI, false);
  ctx.fill();
  ctx.fillRect(state.shooterBase.x - heroSize, state.shooterBase.y, heroSize * 2, heroSize);

  // draw hero nozzle
  ctx.lineWidth = constants.nozzleWidth;
  ctx.beginPath();
  ctx.moveTo(state.shooterNozzle.x, state.shooterNozzle.y);
  ctx.lineTo(state.shooterBase.x, state.shooterBase.y);
  ctx.stroke();

  // draw hero bullet
  if (state.pellet){
    ctx.beginPath();
    ctx.arc(state.pellet.x, state.pellet.y, constants.nozzleWidth, 0, 2 * Math.PI, false);
    ctx.fill();
  };

  ctx.strokeStyle = '#FFFFFF';
  state.walls.forEach(wall => {
    ctx.fillStyle = 'gray';
    ctx.fillRect(wall.start.x, wall.start.y, wall.width, wall.height);
  });

  for (let i = 0; i < 3; i++){
    ctx.fillStyle = i % 2 === 0 ? 'red' : 'white';
    const radius = state.target.radius * (1 - (0.3 * i));
    ctx.beginPath();
    ctx.arc(state.target.x, state.target.y, radius, 0, 2 * Math.PI, false);
    ctx.fill();
  }

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
}
