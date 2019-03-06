const app = {};
const keyboard = {};
const state = {
  gameOn: false,
  heroPosition: {x: 0, y: 0},
  heroBullet: null,
  enemies: [],
  enemyBullets: [],
};

const functions = [
  {
    key: 'onKeyDown',
    hidePrint: true,
    output: 'code-keydown',
    code: `
if (evt.code === 'Enter'){
  app.startGame();
} else if (evt.code === 'Escape') {
  app.gameOver();
} else if (state.gameOn) {
  keyboard[evt.code] = true;
}
`,
  },
  {
    key: 'onKeyUp',
    hidePrint: true,
    output: 'code-keyup',
    code: `
if (keyboard[evt.code]) {
  delete keyboard[evt.code];
}
`,
  },
  {
    key: 'runGameLoop',
    output: 'code-loop',
    code: `
// check keyboard input, perform actions
if (keyboard.Space && !state.heroBullet) {
  app.shootHeroBullet();
}
if (keyboard.ArrowLeft) {
  app.moveHeroLeft();
}
if (keyboard.ArrowRight) {
  app.moveHeroRight();
}
if (keyboard.ArrowUp) {
  app.moveHeroUp();
}
if (keyboard.ArrowDown) {
  app.moveHeroDown();
}

state.enemies.forEach(e => {
  app.moveEnemy(e);
});

// move bullets
if (state.heroBullet) {
  app.moveHeroBullet();
}
state.enemyBullets.forEach(eb => {
  app.moveEnemyBullet(eb);
});

// update canvas
app.draw();
`,
  },
  {
    key: 'startGame',
    code: `
state.gameOn = true;
state.heroPosition.x = canvasElm.width / 2;
state.heroPosition.y = canvasElm.height - 100;
`,
  },
  {
    key: 'gameOver',
    code: `
state.gameOn = false;
`,
  },
  {
    key: 'shootHeroBullet',
    code: `
state.heroBullet = {
  x: state.heroPosition.x,
  y: state.heroPosition.y,
};
`,
  },
  {
    key: 'despawnHeroBullet',
    code: `
state.heroBullet = null;
`,
  },
  {
    key: 'moveHeroLeft',
    code: `
state.heroPosition.x += -5;
`,
  },
  {
    key: 'moveHeroRight',
    code: `
state.heroPosition.x += 5;
`,
  },
  {
    key: 'moveHeroUp',
    code: `
state.heroPosition.y += -5;
`,
  },
  {
    key: 'moveHeroDown',
    code: `
state.heroPosition.y += 5;
`,
  },
  {
    key: 'moveHeroBullet',
    code: `
state.heroBullet.y -= 20;
if (state.heroBullet.y < 0){
  app.despawnHeroBullet();
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
