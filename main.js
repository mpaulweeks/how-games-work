const codeBlocksByKey = {};
const linesByKey = {};

const nextColor = (() => {
  let current = 0;
  return () => {
    current = (current + 1) % 5;
    return current;
  };
})();

// todo make this a smarter lookup
const allLines = [];
let pendingHighlights = [];
let toPrint = [];

const printFunc = func => {
  let opacity = 0;
  let node = codeBlocksByKey[func.key];
  if (node){
    opacity = parseFloat(window.getComputedStyle(node).opacity);
  } else {
    node = func.output ? document.getElementById(func.output) : document.createElement('div');
    node.classList.add('code');
    codeBlocksByKey[func.key] = node;

    const lineElms = func.display.forEach(line => {
      const lineElm = document.createElement('div');
      lineElm.classList.add('line');
      if (line.trim().slice(0,3) === '// ') {
        lineElm.classList.add('comment');
      }
      lineElm.innerHTML = line;

      node.appendChild(lineElm);
      allLines.push(lineElm);
    });

    // <line x1="50" y1="50" x2="350" y2="350" stroke="white"/>
    let newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    document.getElementById('svg').appendChild(newLine);
    linesByKey[func.key] = newLine;
  }
  const pointer = linesByKey[func.key];

  // always ensure show
  node.classList.add('show');
  Array.from(node.children).forEach(line => {
    line.setAttribute('data-color', '');
    line.classList.remove('highlight');
  });

  if (!func.output){
    document.getElementById('code-temp').prepend(node);
    if (parseFloat(opacity) === 0){
      func.highlight = nextColor();
    }
    node.setAttribute('data-color', func.highlight);
    pendingHighlights.push(func);
  }
}
const printHighlights = () => {
  allLines.forEach(line => {
    pendingHighlights.forEach(func => {
      if (!line.innerHTML.includes('=&gt;') && line.innerHTML.includes(func.key)){
        console.log(line.innerHTML);
        line.setAttribute('data-color', func.highlight);
        line.classList.add('highlight');
        const pointer = linesByKey[func.key];
        const lineRect = line.getBoundingClientRect();
        pointer.setAttribute('x1', lineRect.x + lineRect.width/2);
        pointer.setAttribute('y1', lineRect.bottom);
        const funcRect = codeBlocksByKey[func.key].getBoundingClientRect();
        pointer.setAttribute('x2', funcRect.left);
        pointer.setAttribute('y2', funcRect.top);
        console.log(lineRect);
      }
    });
  });
  pendingHighlights = [];
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
  app[func.key] = (...args) => {
    if (!func.hidePrint){
      toPrint.push(func);
    }
    func.code(...args);
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
    toPrint.forEach(printFunc);
    toPrint = [];
    printState();
    // printKeyboard();
    if (state.gameOn){
      app.runGameLoop();
    }
    printHighlights();
    return new Promise((resolve, reject) => {
      window.requestAnimationFrame(resolve);
    });
  };
  while(true) {
    await runLoop();
  }
})();
