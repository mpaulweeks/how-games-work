const functions = [
  {
    key: 'onKeyDown',
    hidePrint: true,
    output: 'code-keydown',
    code: (evt) => {
      if (evt.code === 'Escape') {
        state.paused = !state.paused;
        return;
      }
      if (evt.code === 'KeyQ') {
        app.completeLevel();
        return;
      }
      keyboard[evt.code] = true;
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
        app.despawnPellet();
        app.completeLevel();
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

      // move twice to clear the wall
      pellet.x += 2 * pellet.dx;
      pellet.y += 2 * pellet.dy;
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
        if (wall.absorb) {
          app.despawnPellet();
        } else {
          app.bounceOffWall(pellet, wall);
        }
      }
    },
  },
  {
    key: 'runGameLoop',
    output: 'code-loop',
    code: () => {
      // check keyboard input, perform actions
      if (keyboard.Space)
        app.shootPellet(state.shooterNozzle);
      if (keyboard.ArrowLeft)
        app.moveHeroLeft();
      if (keyboard.ArrowRight)
        app.moveHeroRight();
      if (keyboard.ArrowUp)
        app.angleHeroLeft();
      if (keyboard.ArrowDown)
        app.angleHeroRight();
      if (keyboard.Enter && state.complete)
        app.loadLevel();

      if (state.pellet) {
        const pellet = state.pellet;
        pellet.x += pellet.dx;
        pellet.y += pellet.dy;

        state.level.walls.forEach(wall => {
          app.checkWallHit(pellet, wall);
        });
        app.checkTargetHit(pellet, state.level.target);

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
    },
  },
  {
    key: 'loadLevel',
    code: (reload) => {
      app.calibrateCanvas();
      state.complete = false;

      state.shooterBase.x = canvasElm.width / 2;
      state.shooterBase.y = canvasElm.height - constants.heroSize;
      state.shooterAngle = Math.PI / 2;
      app.calcNozzlePosition();
      state.pellet = null;

      const allLevels = getLevelData();
      let nextLevelIndex = state.level.index;
      if (!reload) {
        nextLevelIndex++;
        if (nextLevelIndex >= allLevels.length) {
          nextLevelIndex = 1;
        }
      }
      state.level = allLevels[nextLevelIndex];
    },
  },
  {
    key: 'resetLevel',
    code: () => {
      app.loadLevel(true);
    },
  },
  {
    key: 'completeLevel',
    code: () => {
      state.complete = true;
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
    // these are populated by main.js
    codeElm: undefined,
    pointers: [],
}));
