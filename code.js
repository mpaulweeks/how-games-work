const app = {
  keyboardInput: {},
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
    k: 'onKeyPress',
    c: `
app.keyboardInput[evt.code] = true;
`,
  },
  {
    k: 'onLoop',
    c: `
// check keyboard input, perform actions
if (app.keyboard.SpaceBar && !app.state.isAirborne) {
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
    k: 'jump',
    c: `
app.state.isAirborne = true;
app.state.speedY = 10;
`,
  }
];
