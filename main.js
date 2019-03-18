const domLookup = {};

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
  let { codeElm, pointerElm } = domLookup[func.key] || {};
  if (codeElm){
    opacity = parseFloat(window.getComputedStyle(codeElm).opacity);
  } else {
    codeElm = func.output ? document.getElementById(func.output) : document.createElement('div');
    codeElm.classList.add('code');
    codeElm.classList.add('showable');
    pointerElm = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    pointerElm.classList.add('showable');
    document.getElementById('svg').appendChild(pointerElm);
    domLookup[func.key] = { codeElm, pointerElm };

    const lineElms = func.display.forEach(line => {
      const lineElm = document.createElement('div');
      lineElm.classList.add('line');
      if (line.trim().slice(0,3) === '// ') {
        lineElm.classList.add('comment');
      }
      lineElm.innerHTML = line;

      codeElm.appendChild(lineElm);
      allLines.push(lineElm);
    });
  }

  // add show to make it fade in
  // main loop removes show immediately afterward
  codeElm.classList.add('show');
  pointerElm.classList.add('show');
  Array.from(codeElm.children).forEach(line => {
    line.setAttribute('data-color', '');
    line.classList.remove('highlight');
  });

  if (!func.output){
    document.getElementById('code-temp').prepend(codeElm);
    if (parseFloat(opacity) === 0){
      func.highlight = nextColor();
    }
    codeElm.setAttribute('data-color', func.highlight);
    pointerElm.setAttribute('data-color', func.highlight);
    pendingHighlights.push(func);
  }
}
const printHighlights = () => {
  allLines.forEach(line => {
    pendingHighlights.forEach(func => {
      if (!line.innerHTML.includes('=&gt;') && line.innerHTML.includes(func.key)){
        line.setAttribute('data-color', func.highlight);
        line.classList.add('highlight');
      }
    });
  });
  pendingHighlights = [];
}
const printPointers = () => {
  allLines.forEach(line => {
    Object.keys(domLookup).forEach(funcKey => {
      if (!line.innerHTML.includes('=&gt;') && line.innerHTML.includes(funcKey)){
        const { codeElm, pointerElm } = domLookup[funcKey];
        const lineRect = line.getBoundingClientRect();
        // todo must be better way than pointing from halfway thru line
        pointerElm.setAttribute('x1', lineRect.x + lineRect.width/2);
        pointerElm.setAttribute('y1', lineRect.bottom);
        const funcRect = codeElm.getBoundingClientRect();
        pointerElm.setAttribute('x2', funcRect.left);
        pointerElm.setAttribute('y2', funcRect.top);
      }
    });
  });
}
const printState = () => {
  document.getElementById('code-state').innerHTML = (
    JSON.stringify(state, Object.keys(state).sort().concat('x', 'y'), 2)
  );
}
const printKeyboard = () => {
  document.getElementById('code-keyboard').innerHTML = (
    JSON.stringify(keyboard, Object.keys(keyboard).sort(), 2)
  );
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
  app.draw();
  app.runGameLoop();
  app.onKeyDown({code: null});
  app.onKeyUp({code: null});
  state.gameOn = true;

  const runLoop = async () => {
    // console.log('loop');

    // try to hide all code blocks
    Object.keys(domLookup).forEach(funcKey => {
      const { codeElm, pointerElm } = domLookup[funcKey];
      codeElm.classList.remove('show');
      pointerElm.classList.remove('show');
    });

    // run code, maybe show some code blocks
    printState();
    // printKeyboard();
    if (state.gameOn){
      app.runGameLoop();
    }
    toPrint.forEach(printFunc);
    toPrint = [];
    printHighlights();
    printPointers();
    return new Promise((resolve, reject) => {
      window.requestAnimationFrame(resolve);
    });
  };
  while(true) {
    await runLoop();
  }
})();
