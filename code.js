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
  pellet: null,
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
    key: 'shootPellet',
    code: (nozzle) => {
      state.pellet = {
        x: nozzle.x,
        y: nozzle.y,
        dx: nozzle.dx,
        dy: nozzle.dy,
      };
    },
  },
  {
    key: 'despawnPellet',
    code: () => {
      state.pellet = null;
    },
  },
  {
    key: 'checkTargetHit',
    code: (pellet, target) => {
      const distance = Math.sqrt(
        Math.pow(pellet.x - target.x, 2) +
        Math.pow(pellet.y - target.y, 2)
      );
      if (distance <= target.radius) {
        app.gameOver();
      }
    },
  },
  {
    key: 'bounceOffWall',
    code: (pellet, wall) => {
      // move backwards to get out of wall
      pellet.x -= pellet.dx;
      pellet.y -= pellet.dy;

      // reverse direction depending on wall type
      if (wall.width > wall.height) {
        pellet.dy *= -1;
      } else {
        pellet.dx *= -1;
      }
    },
  },
  {
    key: 'checkWallHit',
    code: (pellet, wall) => {
      const isHit = (
        wall.start.x < pellet.x &&
        wall.start.x + wall.width > pellet.x &&
        wall.start.y < pellet.y &&
        wall.start.y + wall.height > pellet.y
      );
      if (isHit) {
        app.bounceOffWall(pellet, wall);
      }
    },
  },
  {
    key: 'runGameLoop',
    output: 'code-loop',
    code: () => {
      state.ticks += 1;

      // check keyboard input, perform actions
      if (keyboard.Space && !state.pellet)
        app.shootPellet(state.shooterNozzle);
      if (keyboard.ArrowLeft)
        app.moveHeroLeft();
      if (keyboard.ArrowRight)
        app.moveHeroRight();
      if (keyboard.ArrowUp)
        app.angleHeroLeft();
      if (keyboard.ArrowDown)
        app.angleHeroRight();

      if (state.pellet) {
        const pellet = state.pellet;
        pellet.x += pellet.dx;
        pellet.y += pellet.dy;

        state.walls.forEach(wall => {
          app.checkWallHit(pellet, wall);
        });
        app.checkTargetHit(pellet, state.target);

        let outOfBounds = (
          pellet.x < 0 ||
          pellet.x > constants.canvasWidth ||
          pellet.y < 0 ||
          pellet.y > constants.canvasHeight
        );
        if (outOfBounds){
          app.despawnPellet();
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

      state.pellet = null;
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
      const angleX = Math.cos(angle);
      const angleY = Math.sin(angle);
      state.shooterNozzle = {
        x: base.x + (angleX * length),
        y: base.y - (angleY * length),
        dx: angleX * constants.bulletSpeed,
        dy: angleY * constants.bulletSpeed * -1,
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
