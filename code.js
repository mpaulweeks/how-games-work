const app = {
  isAirborne: false,
  speedY: 0,
  speedX: 0,
};

const functions = [
  {
    k: 'onLoop',
    c: `
// check keyboard input
// perform actions
// move character
`,
  },
  {
    k: 'onSpaceBar',
    c: `
console.log('you jumped!');
app.jump();
`,
  },
  {
    k: 'jump',
    c: `
if (!app.isAirborne){
  app.isAirborne = true;
  app.speedY = 10;
}
`,
  }
];
