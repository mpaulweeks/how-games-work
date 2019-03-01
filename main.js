const printFunc = func => {
  // todo print in UI
  console.log(func.c);
}

// make them talk to each other, surface for printing
functions.forEach(func => {
  app[func.k] = () => {
    printFunc(func);
    eval(func.c);
  };
});
