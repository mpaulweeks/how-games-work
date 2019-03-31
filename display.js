
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
  let opacity = 0;
  let { codeElm } = func;
  if (codeElm){
    opacity = parseFloat(window.getComputedStyle(codeElm).opacity);
  } else {
    codeElm = func.output ? document.getElementById(func.output) : document.createElement('div');
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
      lineElm.addEventListener('click', () => {
        if (state.paused) {
          printDuringPause(lineElm);
        }
      });
    });
  }

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
    if (parseFloat(opacity) === 0){
      func.highlight = nextColor();
      codeElm.setAttribute('data-color', func.highlight);
    }
  }
}
const printDuringPause = line => {
  functions.forEach(func => {
    func.pointers.forEach(pointer => {
      if (pointer.line === line){
        printFunc(func);
        printHighlight(line, func);
      }
    });
  });
}
const printHighlight = (line, func) => {
  line.setAttribute('data-color', func.highlight);
  line.classList.add('highlight');
  connectPointer(line, func);
}
const processPrints = () => {
  toPrint.forEach(printFunc);
  toPrint = [];
};
const processHighlights = () => {
  pendingHighlights.forEach(highlight => {
    const { parent, child } = highlight;
    Array.from(parent.codeElm.children).forEach(line => {
      if (line.innerHTML.includes(child.key)){
        printHighlight(line, child);
      }
    });
  });
  pendingHighlights = [];
};
const connectPointer = (line, func) => {
  let pointer = func.pointers.filter(p => p.line === line)[0];
  if (!pointer){
    const pe = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    pe.classList.add('showable');
    document.getElementById('svg').appendChild(pe);
    pointer = {
      line: line,
      pointerElm: pe,
    };
    func.pointers.push(pointer);
  }
  pointer.pointerElm.classList.add('show');
  pointer.pointerElm.setAttribute('data-color', func.highlight);
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
