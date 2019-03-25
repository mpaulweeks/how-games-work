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
  shooterBase: {x: 0, y: 0},
  shooterNozzle: {x: 0, y: 0},
  shooterAngle: Math.PI / 2,
  heroBullet: null,
  target: {x: 0, y: 0, radius: 0},
  level: 0,
  walls: [],
};
const constants = {
  heroSize: 20,
  heroSpeed: 5,
  bulletSpeed: 10,
  minX: 0,
  minY: 0,
  maxX: 0,
  maxY: 0,
  nozzleLength: 40,
  nozzleSpeed: 0.05,
  nozzleWidth: 6,
  barrierWidth: 20,
  maxAngle: Math.PI - 0.2,
  minAngle: 0.2,
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
    key: 'shootBullet',
    code: () => {
      const noz = state.shooterNozzle;
      const base = state.shooterBase;
      state.heroBullet = {
        x: noz.x,
        y: noz.y,
        dx: (noz.x - base.x) * constants.bulletSpeed / constants.nozzleLength,
        dy: (noz.y - base.y) * constants.bulletSpeed / constants.nozzleLength,
      };
    },
  },
  {
    key: 'despawnBullet',
    code: () => {
      state.heroBullet = null;
    },
  },
  {
    key: 'checkTargetHit',
    code: () => {
      const distance = Math.sqrt(
        Math.pow(state.heroBullet.x - state.target.x, 2) +
        Math.pow(state.heroBullet.y - state.target.y, 2)
      );
      if (distance <= state.target.radius) {
        app.gameOver();
      }
    },
  },
  {
    key: 'checkWallHit',
    code: (wall) => {
      const bullet = state.heroBullet;
      const isHit = (
        wall.start.x < bullet.x &&
        wall.start.x + wall.width > bullet.x &&
        wall.start.y < bullet.y &&
        wall.start.y + wall.height > bullet.y
      );
      if (isHit) {
        // move backwards
        bullet.x -= bullet.dx;
        bullet.y -= bullet.dy;

        if (wall.width > wall.height) {
          bullet.dy *= -1;
        } else {
          bullet.dx *= -1;
        }
      }
    },
  },
  {
    key: 'checkBulletDespawn',
    code: () => {
      let outOfBounds = (
        state.heroBullet.x < 0 ||
        state.heroBullet.x > constants.canvasWidth ||
        state.heroBullet.y < 0 ||
        state.heroBullet.y > constants.canvasHeight
      );
      if (outOfBounds){
        app.despawnBullet();
      }
    },
  },
  {
    key: 'runGameLoop',
    output: 'code-loop',
    code: () => {
      state.ticks += 1;

      // check keyboard input, perform actions
      if (keyboard.Space && !state.heroBullet)
        app.shootBullet();
      if (keyboard.ArrowLeft)
        app.moveHeroLeft();
      if (keyboard.ArrowRight)
        app.moveHeroRight();
      if (keyboard.ArrowUp)
        app.angleHeroLeft();
      if (keyboard.ArrowDown)
        app.angleHeroRight();

      if (state.heroBullet) {
        state.heroBullet.x += state.heroBullet.dx;
        state.heroBullet.y += state.heroBullet.dy;

        app.checkTargetHit();
        state.walls.forEach(wall => {
          app.checkWallHit(wall);
        });

        let outOfBounds = (
          state.heroBullet.x < 0 ||
          state.heroBullet.x > constants.canvasWidth ||
          state.heroBullet.y < 0 ||
          state.heroBullet.y > constants.canvasHeight
        );
        if (outOfBounds){
          app.despawnBullet();
        }
      }

      // update the canvas
      app.draw();
    },
  },
  {
    key: 'startGame',
    code: () => {
      state.gameOn = true;
      state.ticks = 0;

      state.shooterBase.x = canvasElm.width / 2;
      state.shooterBase.y = canvasElm.height - constants.heroSize;
      state.shooterAngle = Math.PI / 2;
      app.calcNozzlePosition();

      state.heroBullet = null;
      state.target = {
        x: constants.canvasWidth / 2,
        y: 100,
        radius: 50,
      };
      state.walls = [
        {
          start: {x: 0, y: 0},
          width: constants.barrierWidth,
          height: constants.canvasHeight,
        },
        {
          start: {x: constants.canvasWidth - constants.barrierWidth, y: 0},
          width: constants.barrierWidth,
          height: constants.canvasHeight,
        },
      ];
    },
  },
  {
    key: 'gameOver',
    code: () => {
      state.gameOn = false;
    },
  },
  {
    key: 'calcNozzlePosition',
    code: () => {
      const base = state.shooterBase;
      const angle = state.shooterAngle;
      const length = constants.nozzleLength;
      state.shooterNozzle = {
        x: base.x + (Math.cos(angle) * length),
        y: base.y - (Math.sin(angle) * length),
      };
    },
  },
  {
    key: 'moveHeroLeft',
    code: () => {
      state.shooterBase.x -= constants.heroSpeed;
      if (state.shooterBase.x < constants.minX) {
        state.shooterBase.x = constants.minX;
      }
      app.calcNozzlePosition();
    },
  },
  {
    key: 'moveHeroRight',
    code: () => {
      state.shooterBase.x += constants.heroSpeed;
      if (state.shooterBase.x > constants.maxX) {
        state.shooterBase.x = constants.maxX;
      }
      app.calcNozzlePosition();
    },
  },
  {
    key: 'angleHeroLeft',
    code: () => {
      state.shooterAngle += constants.nozzleSpeed;
      if (state.shooterAngle > constants.maxAngle) {
        state.shooterAngle = constants.maxAngle;
      }
      app.calcNozzlePosition();
    },
  },
  {
    key: 'angleHeroRight',
    code: () => {
      state.shooterAngle -= constants.nozzleSpeed;
      if (state.shooterAngle < constants.minAngle) {
        state.shooterAngle = constants.minAngle;
      }
      app.calcNozzlePosition();
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
