const app = {
  randomShadeOfGrey: () => {
    function randomNoise(){
      return Math.floor(Math.random() * 40);
    }
    const shade = Math.floor(Math.random() * 100) + 100;
    return `rgb(${shade + randomNoise()}, ${shade + randomNoise()}, ${shade - randomNoise()})`;
  },
};
const keyboard = {};
const state = {
  gameOn: false,
  heroPosition: {x: 0, y: 0},
  heroBullet: null,
  enemies: [],
  orbs: [],
};
const constants = {
  buffer: 50,
  bodySize: 25,
  heroSpeed: 3,
  orbSpeed: 40,
  maxOrbs: 50,
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
        if (!state.gameOn){
          app.startGame();
        }
      } else if (evt.code === 'Escape') {
        app.gameOver();
        app.draw();
      } else if (evt.code === 'KeyQ') {
        app.spawnEnemy();
      } else if (state.gameOn) {
        keyboard[evt.code] = true;
      }
      if (evt.code === 'Space' || evt.code.includes('Arrow')){
        evt.preventDefault();
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
        color: app.randomShadeOfGrey(),
        x: Math.random() * constants.canvasWidth,
        y: constants.enemySpawnY,
        dx: (Math.random() - 0.5) * 2,
        dy: (Math.random() - 0.5) * 2,
      });
    },
  },
  {
    key: 'moveEnemy',
    code: (enemy) => {
      enemy.x += enemy.dx;
      enemy.y += enemy.dy;
      if (enemy.x < constants.minX)
        enemy.dx = Math.abs(enemy.dx);
      if (enemy.x > constants.maxX)
        enemy.dx = 0 - Math.abs(enemy.dx);
      if (enemy.y < constants.enemyMinY)
        enemy.dy = Math.abs(enemy.dy);
      if (enemy.y > constants.enemyMaxY)
        enemy.dy = 0 - Math.abs(enemy.dy);
    },
  },
  {
    key: 'shootOrb',
    code: (enemy) => {
      for (let i = 0; i < state.orbs.length; i++){
        if (!state.orbs[i].alive){
          state.orbs[i] = {
            alive: true,
            index: i,
            color: enemy.color,
            x: enemy.x,
            y: enemy.y,
            radius: 5 + Math.floor(Math.random() * 5),
          };
          break;
        }
      }
    },
  },
  {
    key: 'despawnOrb',
    code: (orb) => {
      orb.alive = false;
    },
  },
  {
    key: 'checkHeroHit',
    code: (orb) => {
      const distance = Math.sqrt(
        Math.pow(state.heroPosition.x - orb.x, 2) +
        Math.pow(state.heroPosition.y - orb.y, 2)
      );
      return distance <= orb.radius;
    },
  },
  {
    key: 'runGameLoop',
    output: 'code-loop',
    code: () => {
      // move enemies around
      state.enemies.forEach(e => {
        if (Math.random() < 0.03)
          app.shootOrb(e);
        app.moveEnemy(e);
      });

      // spawn new enemies every ~300 frames
      if (Math.random() < 0.003)
        app.spawnEnemy();

      // check keyboard input, perform actions
      if (keyboard.ArrowLeft)
        app.moveHeroLeft();
      if (keyboard.ArrowRight)
        app.moveHeroRight();
      if (keyboard.ArrowUp)
        app.moveHeroUp();
      if (keyboard.ArrowDown)
        app.moveHeroDown();

      // check for hero being hit
      state.orbs.forEach(orb => {
        if (!orb.alive)
          return;
        orb.y += 0.1 * constants.orbSpeed;
        if (app.checkHeroHit(orb))
          // app.gameOver();
          console.log('dead');
        if (orb.y > constants.canvasHeight + orb.radius)
          app.despawnOrb(orb);
      });

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
      state.heroBullet = null;
      state.enemies = [];
      state.orbs = [];
      for (let i = 0; i < 10; i++){
        app.spawnEnemy();
      }
      for (let i = 0; i < constants.maxOrbs; i++){
        state.orbs[i] = {
          alive: false,
        };
      }
    },
  },
  {
    key: 'gameOver',
    code: () => {
      state.gameOn = false;
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
