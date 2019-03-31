const app = {};
const keyboard = {};
const state = {
  paused: false,
  complete: true,
  level: {index: -1},
  shooterBase: {x: 0, y: 0},
  shooterNozzle: {x: 0, y: 0},
  shooterAngle: Math.PI / 2,
  pellet: null,
  target: {x: 0, y: 0, radius: 0},
  walls: [],
};
const constants = {
  nozzleSpeed: 0.05,
  maxAngle: Math.PI - 0.2,
  minAngle: 0.2,
};
