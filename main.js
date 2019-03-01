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

// make them talk to each other, surface for printing
functions.forEach(func => {
  app[func.key] = evt => {
    printFunc(func);
    eval(func.code);
  };
});

window.addEventListener('keydown', evt => {
  console.log(evt.code);
  app.onKeyPress(evt);
});

// init
(async () => {
  // paint these once on page load
  app.onLoop();
  app.onKeyPress({code: null});

  const runLoop = async () => {
    console.log('loop');

    // try to hide all code blocks
    Object.keys(codeBlocksByKey).forEach(codeKey => codeBlocksByKey[codeKey].classList.remove('show'));

    // run code, maybe show some code blocks
    app.onLoop();
    return new Promise((resolve, reject) => {
      window.requestAnimationFrame(resolve);
    });
  };
  while(!app.keyboard.Escape) {
    await runLoop();
  }
})();
