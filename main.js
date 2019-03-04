const codeBlocksByKey = {};

const printFunc = func => {
  if (!codeBlocksByKey[func.key]){
    const newNode = func.output ? document.getElementById(func.output) : document.createElement('div');
    newNode.classList.add('code');
    codeBlocksByKey[func.key] = newNode;

    const code = func.display.join('\n');
    newNode.innerHTML = code;
  }
  const node = codeBlocksByKey[func.key];
  node.classList.add('show');
  if (!func.output){
    document.getElementById('code-temp').prepend(node);
  }
}
const printState = () => {
  const node = document.getElementById('code-state');
  node.innerHTML = JSON.stringify(state, Object.keys(state).sort().concat('x', 'y'), 2);
}
const printKeyboard = () => {
  const node = document.getElementById('code-keyboard');
  node.innerHTML = JSON.stringify(keyboard, Object.keys(keyboard).sort(), 2);
}

// make them talk to each other, surface for printing
functions.forEach(func => {
  app[func.key] = evt => {
    printFunc(func);
    eval(func.code);
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

// init
(async () => {
  // paint these once on page load
  app.runGameLoop();
  app.onKeyDown({code: null});
  app.onKeyUp({code: null});
  state.gameOn = true;

  const runLoop = async () => {
    // console.log('loop');

    // try to hide all code blocks
    Object.keys(codeBlocksByKey).forEach(codeKey => codeBlocksByKey[codeKey].classList.remove('show'));

    // run code, maybe show some code blocks
    printState();
    // printKeyboard();
    if (state.gameOn){
      app.runGameLoop();
    }
    return new Promise((resolve, reject) => {
      window.requestAnimationFrame(resolve);
    });
  };
  while(true) {
    await runLoop();
  }
})();
