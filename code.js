const app = {
  keyboard: {},
  state: {
    isAirborne: false,
    positionX: 0,
    positionY: 0,
    speedY: 0,
    speedX: 0,
  },
};

const functions = [
  {
    key: 'onKeyPress',
    code: `
app.keyboard[evt.code] = true;
`,
  },
  {
    key: 'onLoop',
    output: 'code-loop',
    code: `
// check keyboard input, perform actions
if (app.keyboard.Space) {
  app.jump();
}

// move character
if (app.state.speedX !== 0) {
  app.applyFriction();
}
app.keyboard = {};
`,
  },
  {
    key: 'jump',
    code: `
app.state.isAirborne = true;
app.state.speedY = 10;
`,
  }
].map(func => ({
  ...func,
  display: func.code.trim(),
}));
