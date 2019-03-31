const getLevelData = () => {
  const c = constants;
  const barrierWidth = c.heroSize;
  const defaultWalls = [
    {
      start: {x: 0, y: 0},
      width: barrierWidth,
      height: c.canvasHeight,
    },
    {
      start: {x: c.canvasWidth - barrierWidth, y: 0},
      width: barrierWidth,
      height: c.canvasHeight,
    },
  ];
  return [
    {
      title: 'TRICKSHOT',
      subtitles: [
        'press SPACE to shoot',
        'you can only have one pellet at a time',
        '',
        'press ENTER to start',
      ],
      target: {
        x: -500,
        y: -500,
        radius: c.heroSize,
      },
      walls: defaultWalls,
    },
    {
      title: 'LEVEL COMPLETE',
      subtitles: [
        'press LEFT / RIGHT arrow to move',
        'lineup your shoot to hit the target!',
        '',
        'press ENTER to proceed',
      ],
      target: {
        x: c.canvasWidth / 2,
        y: c.heroSize*4,
        radius: c.heroSize*2,
      },
      walls: defaultWalls,
    },
    {
      title: 'LEVEL COMPLETE',
      subtitles: [
        'press UP / DOWN arrow to aim',
        'you can ricochet your shots off walls!',
        '',
        'press ENTER to proceed',
      ],
      target: {
        x: c.canvasWidth * 3 / 4,
        y: c.heroSize*4,
        radius: c.heroSize*2,
      },
      walls: defaultWalls,
    },
    {
      title: 'LEVEL COMPLETE',
      subtitles: [
        'avoid the yellow walls',
        'they absorb your pellet',
        '',
        'press ENTER to proceed',
      ],
      target: {
        x: c.canvasWidth / 4,
        y: c.heroSize*4,
        radius: c.heroSize*2,
      },
      walls: [
        {
          start: {x: 0, y: c.canvasHeight / 2},
          width: barrierWidth,
          height: c.canvasHeight,
        },
        {
          start: {x: c.canvasWidth - barrierWidth, y: 0},
          width: barrierWidth,
          height: c.canvasHeight,
        },
        {
          start: {x: 0, y: c.canvasHeight / 2},
          width: c.canvasWidth*2/3,
          height: barrierWidth,
        },
      ],
    },
    {
      title: 'LEVEL COMPLETE',
      subtitles: [
        'now you know all the basics!',
        '',
        'press ENTER to proceed',
      ],
      target: {
        x: c.canvasWidth / 2,
        y: c.heroSize*3,
        radius: c.heroSize,
      },
      walls: [
        {
          start: {x: 0, y: 0},
          width: barrierWidth,
          height: c.canvasHeight*2/3,
        },
        {
          start: {x: c.canvasWidth - barrierWidth, y: c.canvasHeight*1/3},
          width: barrierWidth,
          height: c.canvasHeight*2/3,
        },
        {
          absorb: true,
          start: {x: 0, y: c.canvasHeight*2/3},
          width: c.canvasWidth*2/3,
          height: barrierWidth,
        },
        {
          absorb: true,
          start: {x: c.canvasWidth*1/3, y: c.canvasHeight*1/3},
          width: c.canvasWidth*2/3,
          height: barrierWidth,
        },
      ],
    },
    {
      title: 'LEVEL COMPLETE',
      subtitles: [
        'press ENTER to proceed',
      ],
      target: {
        x: c.canvasWidth / 2,
        y: c.heroSize*5,
        radius: c.heroSize,
      },
      walls: [
        {
          start: {x: 0, y: 0},
          width: c.canvasWidth,
          height: barrierWidth,
        },
        {
          start: {x: c.canvasWidth*1/3, y: c.canvasWidth*10/20 - barrierWidth},
          width: c.canvasWidth*1/3,
          height: barrierWidth,
        },
      ],
    },
    {
      title: 'LEVEL COMPLETE',
      subtitles: [
        'you win!',
        '',
        'press ENTER to restart',
      ],
      target: {
        x: c.canvasWidth*5/6,
        y: c.canvasHeight*3/8 + c.heroSize/2,
        radius: c.heroSize,
      },
      walls: [
        ...defaultWalls,
        {
          start: {x: 0, y: 0},
          width: c.canvasWidth,
          height: barrierWidth,
        },
        {
          start: {x: c.canvasWidth*2/3, y: c.canvasHeight*2/4},
          width: c.canvasWidth*1/3,
          height: barrierWidth,
        },
        {
          absorb: true,
          start: {x: c.canvasWidth*2/3, y: c.canvasHeight*1/4},
          width: c.canvasWidth*1/6,
          height: barrierWidth,
        },
        {
          absorb: true,
          start: {x: c.canvasWidth*2/3, y: c.canvasHeight*1/4},
          width: barrierWidth,
          height: c.canvasHeight*1/4,
        },
      ],
    },
  ].map((data, index) => ({
    ...data,
    index,
  }));
};
