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
  bulletSpeed: 40,
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
      } else if (evt.code === 'KeyQ') {
        app.spawnEnemy();
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
    key: 'spawnEnemy',
    code: () => {
      state.enemies.push({
        color: '#606060',
        x: constants.enemySpawnX,
        y: constants.enemySpawnY,
        dx: -2,
        dy: (Math.random() - 0.5) * 2,
      });
    },
  },
  {
    key: 'moveEnemyShip',
    hidePrint: true,
    code: (enemy) => {
      enemy.x += enemy.dx;
      enemy.y += enemy.dy;
      if (enemy.x < constants.minX) {
        enemy.dx = Math.abs(enemy.dx);
      }
      if (enemy.x > constants.maxX) {
        enemy.dx = 0 - Math.abs(enemy.dx);
      }
      if (enemy.y < constants.enemyMinY) {
        enemy.dy = Math.abs(enemy.dy);
      }
      if (enemy.y > constants.enemyMaxY) {
        enemy.dy = 0 - Math.abs(enemy.dy);
      }
    },
  },
  {
    key: 'shootEnemyBullet',
    code: (enemy) => {
      state.enemyBullets.push({
        color: enemy.color,
        x: enemy.x,
        y: enemy.y,
      })
    },
  },
  {
    key: 'moveEnemyBullets',
    hidePrint: true,
    code: () => {
      state.enemyBullets = state.enemyBullets.filter(eb => {
        eb.y += 0.1 * constants.bulletSpeed;
        return eb.y < constants.canvasHeight;
      });
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

      // move your bullets
      if (state.heroBullet) {
        app.moveHeroBullet();
      }

      // spawn enemies every ~300 frames
      if (Math.random() < 0.003) {
        app.spawnEnemy();
      }

      // move enemies around
      state.enemies.forEach(e => {
        app.moveEnemyShip(e);
        if (Math.random() < 0.006) {
          app.shootEnemyBullet(e);
        }
      });
      app.moveEnemyBullets();

      // update the canvas
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
      state.heroBullet.y -= constants.bulletSpeed;
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
