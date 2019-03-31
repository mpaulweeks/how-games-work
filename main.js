
// make them talk to each other, surface for printing
functions.forEach(func => {
  app[func.key] = (...args) => {
    if (!func.hidePrint){
      toPrint.push(func);
    }
    const parent = callStack.pop();
    if (parent && !parent.hidePrint){
      pendingHighlights.push({
        parent: parent,
        child: func,
      });
      callStack.push(parent);
    }

    callStack.push(func)
    const result = func.code(...args);
    callStack.pop();
    return result;
  };
});

window.addEventListener('keydown', evt => {
  // console.log(evt.code);
  app.onKeyDown(evt);
});
window.addEventListener('keyup', evt => {
  // console.log(evt.code);
  app.onKeyUp(evt);
});

let resizeTimer;
window.addEventListener('resize', evt => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function() {
    app.resetLevel();
  }, 250);
});

const gameLoop = () => {
  if (!state.paused){
    // try to hide all code blocks
    functions.forEach(func => {
      const { codeElm, pointers } = func;
      if (codeElm){
        codeElm.classList.remove('show');
      }
      pointers.forEach(p => {
        p.pointerElm.classList.remove('show');
      });
    });

    // run code, maybe show some code blocks
    app.runGameLoop();
    processPrints();
    processHighlights();
  }
  updatePointers();
  app.draw();
}

const desiredFPS = 15;
const fpsInterval = 1000/desiredFPS;
let then = Date.now();
let now, elapsed;

const loopRunner = () => {
  requestAnimationFrame(loopRunner);

  // https://stackoverflow.com/a/19772220
  now = Date.now();
  elapsed = now - then;
  if (elapsed > fpsInterval) {
    // Get ready for next frame by setting then=now, but also adjust for your
    // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
    then = now - (elapsed % fpsInterval);
    gameLoop();
  }
};

// init
(async () => {
  app.loadLevel();
  state.complete = true;
  loopRunner();

  setTimeout(() => {
    app.resetLevel();
  }, 100);
})();
