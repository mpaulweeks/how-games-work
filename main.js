
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

const runLoop = async () => {
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
    // printState();
    // printKeyboard();
    app.runGameLoop();
    toPrint.forEach(printFunc);
    toPrint = [];
    processHighlights();
  }
  updatePointers();
  app.draw();

  // return promise that will wait for next frame
  return new Promise((resolve, reject) => {
    window.requestAnimationFrame(resolve);
  });
};

// init
(async () => {
  // paint these once on page load
  // app.draw();
  // app.runGameLoop();
  // app.onKeyDown({code: null});
  // app.onKeyUp({code: null});

  // init ship at bottom
  app.loadLevel();
  state.complete = true;

  while(true) {
    await runLoop();
  }
})();
