const app = {
  keyboard: {},
  state: {
    gameOn: false,
    positionX: 0,
    positionY: 0,
    speedY: 0,
    speedX: 0,
  },
};

const functions = [
  {
    key: 'onKeyDown',
    output: 'code-keydown',
    code: `
if (evt.code === 'Enter'){
  app.state.gameOn = true;
} else if (evt.code === 'Escape') {
  app.state.gameOn = false;
} else if (app.state.gameOn) {
  app.keyboard[evt.code] = true;
}
`,
  },
  {
    key: 'onKeyUp',
    output: 'code-keyup',
    code: `
if (app.keyboard[evt.code]) {
  delete app.keyboard[evt.code];
}
`,
  },
  {
    key: 'runGameLoop',
    output: 'code-loop',
    code: `
// check keyboard input, perform actions
if (app.keyboard.Space) {
  // todo
}
if (app.keyboard.ArrowLeft) {
  app.moveLeft();
}
if (app.keyboard.ArrowRight) {
  app.moveRight();
}
if (app.keyboard.ArrowUp) {
  app.moveUp();
}
if (app.keyboard.ArrowDown) {
  app.moveDown();
}

// move character
if (app.state.speedX || app.state.speedY) {
  app.applySpeed();
}

// update canvas
app.draw();
`,
  },
  {
    key: 'moveLeft',
    code: `
app.state.speedX = -5;
`,
  },
  {
    key: 'moveRight',
    code: `
app.state.speedX = 5;
`,
  },
  {
    key: 'moveUp',
    code: `
app.state.speedY = -5;
`,
  },
  {
    key: 'moveDown',
    code: `
app.state.speedY = 5;
`,
  },
  {
    key: 'applySpeed',
    code: `
app.state.positionX += app.state.speedX;
app.state.speedX = app.state.speedX * 0.9;
if (Math.abs(app.state.speedX) < 0.1){
  app.state.speedX = 0;
}
app.state.positionY += app.state.speedY;
app.state.speedY = app.state.speedY * 0.9;
if (Math.abs(app.state.speedY) < 0.1){
  app.state.speedY = 0;
}
`,
  },
].map(func => ({
  ...func,
  display: [
    `app.${func.key} = () => {`,
    ...func.code.trim().split('\n').map(line => `  ${line}`),
    `}`,
  ],
}));
