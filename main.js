// todo consolidate, better naming
const domLookup = {};
const pointerLinks = {};

const nextColor = (() => {
  let current = 0;
  return () => {
    current = (current + 1) % 5;
    return current;
  };
})();

const callStack = [];
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
  }
}
const printHighlights = () => {
  pendingHighlights.forEach(highlight => {
    const { parent, child } = highlight;
    const { codeElm } = domLookup[parent.key];
    Array.from(codeElm.children).forEach(line => {
      if (line.innerHTML.includes(child.key)){
        line.setAttribute('data-color', child.highlight);
        line.classList.add('highlight');
        connectPointer(line, child);
      }
    });
  });
  pendingHighlights = [];
};
const connectPointer = (line, func) => {
  // todo must be better way than pointing from halfway thru line
  const { pointerElm, codeElm } = domLookup[func.key];
  pointerLinks[func.key] = {
    line,
    pointerElm,
    codeElm,
  };
};
const updatePointers = () => {
  Object.keys(pointerLinks).forEach(pointerLinkKey => {
    // todo must be better way than pointing from halfway thru line
    const { pointerElm, line, codeElm } = pointerLinks[pointerLinkKey];
    const lineRect = line.getBoundingClientRect();
    pointerElm.setAttribute('x1', lineRect.x + lineRect.width/2);
    pointerElm.setAttribute('y1', lineRect.bottom);
    const funcRect = codeElm.getBoundingClientRect();
    pointerElm.setAttribute('x2', funcRect.left);
    pointerElm.setAttribute('y2', funcRect.top);
  });
};
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


const runLoop = async () => {
  // try to hide all code blocks
  Object.keys(domLookup).forEach(funcKey => {
    const { codeElm, pointerElm } = domLookup[funcKey];
    codeElm.classList.remove('show');
    pointerElm.classList.remove('show');
  });

  // run code, maybe show some code blocks
  // printState();
  // printKeyboard();
  app.runGameLoop();
  toPrint.forEach(printFunc);
  toPrint = [];
  printHighlights();
  updatePointers();

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
