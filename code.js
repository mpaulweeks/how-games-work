const app = {};
const keyboard = {};
const state = {
  gameOn: false,
  heroPosition: {x: 0, y: 0},
  heroBullet: null,
  enemies: [],
  enemyBullets: [],
};
const constants = {
  heroSpeed: 10,
  minX: 0,
  minY: 0,
  maxX: 0,
  maxY: 0,
};

const functions = [
  {
    key: 'onKeyDown',
    hidePrint: true,
    output: 'code-keydown',
    code: (evt) => {
      if (evt.code === 'Enter'){
        app.startGame();
      } else if (evt.code === 'Escape') {
        app.gameOver();
      } else if (state.gameOn) {
        keyboard[evt.code] = true;
      }
    },
  },
  {
    key: 'onKeyUp',
    hidePrint: true,
    output: 'code-keyup',
    code: (evt) => {
      if (keyboard[evt.code]) {
        delete keyboard[evt.code];
      }
    },
  },
  {
    key: 'runGameLoop',
    output: 'code-loop',
    code: () => {
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

      // move enemies
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
      },
    },
  {
    key: 'startGame',
    code: () => {
      state.gameOn = true;
      state.heroPosition.x = canvasElm.width / 2;
      state.heroPosition.y = canvasElm.height - 100;
    },
  },
  {
    key: 'gameOver',
    code: () => {
      state.gameOn = false;
    },
  },
  {
    key: 'shootHeroBullet',
    code: () => {
      state.heroBullet = {
        x: state.heroPosition.x,
        y: state.heroPosition.y,
      };
    },
  },
  {
    key: 'despawnHeroBullet',
    code: () => {
      state.heroBullet = null;
    },
  },
  {
    key: 'moveHeroLeft',
    code: () => {
      state.heroPosition.x -= constants.heroSpeed;
      if (state.heroPosition.x < constants.minX) {
        state.heroPosition.x = constants.minX;
      }
    },
  },
  {
    key: 'moveHeroRight',
    code: () => {
      state.heroPosition.x += constants.heroSpeed;
      if (state.heroPosition.x > constants.maxX) {
        state.heroPosition.x = constants.maxX;
      }
    },
  },
  {
    key: 'moveHeroUp',
    code: () => {
      state.heroPosition.y -= constants.heroSpeed;
      if (state.heroPosition.y < constants.minY) {
        state.heroPosition.y = constants.minY;
      }
    },
  },
  {
    key: 'moveHeroDown',
    code: () => {
      state.heroPosition.y += constants.heroSpeed;
      if (state.heroPosition.y > constants.maxY) {
        state.heroPosition.y = constants.maxY;
      }
    },
  },
  {
    key: 'moveHeroBullet',
    code: () => {
      state.heroBullet.y -= 20;
      if (state.heroBullet.y < 0){
        app.despawnHeroBullet();
      }
    },
  },
].map(func => ({
    ...func,
    display: func.code.toString().trim().split('\n').map((line, index, lines) => {
      if (index === 0){
        return `app.${func.key} = ${line}`;
      } else if (index === lines.length - 1){
        return '}';
      } else {
         // making sure each line is whitespace preserves empty lines
        return line.slice(4) || ' ';
      }
    }),
}));
