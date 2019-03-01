const codeBlocksByKey = {};

const printFunc = func => {
  // todo print in UI
  if (func.output) {
    document.getElementById(func.output).innerHTML = func.display;
  } else {
    if (!codeBlocksByKey[func.key]){
      const newNode = document.createElement('div');
      newNode.classList.add('code');
      newNode.innerHTML = func.display;
      codeBlocksByKey[func.key] = newNode;
    }
    const node = codeBlocksByKey[func.key];
    node.classList.add('show');
    document.getElementById('code-temp').prepend(node);
  }
}

// make them talk to each other, surface for printing
functions.forEach(func => {
  app[func.key] = () => {
    printFunc(func);
    eval(func.code);
  };
});

window.addEventListener('keydown', evt => {
  console.log(evt.code);
  app.keyboard[evt.code] = true;
});

// init
(async () => {
  const runLoop = async () => {
    console.log('loop');
    Object.keys(codeBlocksByKey).forEach(codeKey => codeBlocksByKey[codeKey].classList.remove('show'));
    app.onLoop();
    return new Promise((resolve, reject) => {
      window.requestAnimationFrame(resolve);
    });
  };
  while(!app.keyboard.Escape) {
    await runLoop();
  }
})();
