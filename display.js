
const numColors = 12;
const nextColor = (() => {
  let current = 0;
  return () => {
    current = (current + 1) % numColors;
    return current;
  };
})();

const callStack = [];
let pendingHighlights = [];
let toPrint = [];

const printFunc = func => {
  const { codeElm } = func;
  const opacity = parseFloat(window.getComputedStyle(codeElm).opacity);

  // add show to make it fade in
  // main loop removes show immediately afterward
  codeElm.classList.add('show');
  Array.from(codeElm.children).forEach(line => {
    if (line.className.includes('highlight')){
      line.classList.remove('highlight');
      line.setAttribute('data-color', '');
    }
  });

  if (!func.output){
    document.getElementById('code-temp').prepend(codeElm);
    if (isNaN(opacity) || opacity === 0){
      func.highlight = nextColor();
      codeElm.setAttribute('data-color', func.highlight);
    }
  }
}
const printHighlight = (line, func) => {
  line.setAttribute('data-color', func.highlight);
  line.classList.add('highlight');
  printPointer(line, func);
};
const printPointer = (line, func) => {
  let pointer = func.pointers.filter(p => p.line === line)[0];
  if (pointer){
    pointer.pointerElm.classList.add('show');
    pointer.pointerElm.setAttribute('data-color', func.highlight);
  }
};
const processPrints = () => {
  toPrint.forEach(printFunc);
  toPrint = [];
};
const processHighlights = () => {
  pendingHighlights.forEach(highlight => {
    const { parent, child } = highlight;
    child.pointers.forEach(p => {
      if (p.line.parentElement === parent.codeElm){
        printHighlight(p.line, child);
      }
    });
  });
  pendingHighlights = [];
};
const updatePointers = () => {
  functions.forEach(func => {
    // todo must be better way than pointing from halfway thru line
    func.pointers.forEach(pointer => {
      const scrollOffset = document.documentElement.scrollTop;
      const { pointerElm, line } = pointer;
      const lineRect = line.getBoundingClientRect();
      pointerElm.setAttribute('x1', lineRect.x + lineRect.width/2);
      pointerElm.setAttribute('y1', lineRect.bottom + scrollOffset);
      const funcRect = func.codeElm.getBoundingClientRect();
      pointerElm.setAttribute('x2', funcRect.left);
      pointerElm.setAttribute('y2', funcRect.top + scrollOffset);
    });
  });
};
const printDuringPause = line => {
  functions.forEach(func => {
    func.pointers.forEach(pointer => {
      if (pointer.line === line){
        printFunc(func);
        printHighlight(line, func);
      }
    });
  });
};

// create all elms on init
const createFuncElm = func => {
  const codeElm = func.output ? document.getElementById(func.output) : document.createElement('div');
  codeElm.classList.add('code');
  codeElm.classList.add('showable');
  func.codeElm = codeElm;

  const lineElms = func.display.forEach(line => {
    const lineElm = document.createElement('div');
    lineElm.classList.add('line');
    if (line.trim().slice(0,3) === '// ') {
      lineElm.classList.add('comment');
    }
    lineElm.innerHTML = line;

    codeElm.appendChild(lineElm);
  });
};
const createPointer = (line, func) => {
  const pe = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  pe.classList.add('showable');
  document.getElementById('svg').appendChild(pe);
  pointer = {
    line: line,
    pointerElm: pe,
  };
  func.pointers.push(pointer);
  line.classList.add('clickable');
  line.addEventListener('click', () => {
    if (state.paused) {
      printDuringPause(line);
    }
  });
};

// init
(() => {
  // make them talk to each other, encapsulate printing
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
  const visibleFuncs = functions.filter(f => !f.hidePrint);
  visibleFuncs.forEach(func => {
    createFuncElm(func);
  });
  visibleFuncs.forEach(func => {
    visibleFuncs.forEach(caller => {
      if (caller === func){
        return;
      }
      Array.from(caller.codeElm.children).forEach(line => {
        if (line.innerHTML.includes(func.key)){
          createPointer(line, func);
        }
      });
    });
  });
})();

const display = {
  processPrints,
  processHighlights,
  updatePointers,
};
