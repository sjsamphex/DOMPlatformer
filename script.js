class Vec {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  plus(other) {
    return new Vec(this.x + other.x, this.y + other.y);
  }
  minus(other) {
    return new Vec(this.x - other.x, this.y - other.y);
  }
  get length() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }
  times(factor) {
    return new Vec(this.x * factor, this.y * factor);
  }
}

// console.log(new Vec(1, 2).plus(new Vec(2, 3)));
// // → Vec{x: 3, y: 5}
// console.log(new Vec(1, 2).minus(new Vec(2, 3)));
// // → Vec{x: -1, y: -1}
// console.log(new Vec(3, 4).length);
// // → 5
// //console.log(new Vec(2, 3));

let simpleLevelPlan = `
......................
..#................#..
..#..............=.#..
..#.........o.o....#..
..#.@......#####...#..
..#####............#..
......#++++++++++++#..
......##############..
......................`;

class Level {
  constructor(plan) {
    let rows = plan
      .trim()
      .split('\n')
      .map((l) => [...l]);
    this.height = rows.length;
    this.width = rows[0].length;
    this.startActors = [];

    this.rows = rows.map((row, y) => {
      return row.map((ch, x) => {
        let type = levelChars[ch];
        if (typeof type == 'string') return type;
        this.startActors.push(type.create(new Vec(x, y), ch));
        return 'empty';
      });
    });
  }
}

class State {
  constructor(level, actors, status) {
    this.level = level;
    this.actors = actors;
    this.status = status;
  }
  static start(level) {
    return new State(level, level.startActors, 'playing');
  }
  get player() {
    return this.actors.find((a) => a.type == 'player');
  }
}

class Player {
  constructor(pos, speed) {
    this.pos = pos;
    this.speed = speed;
  }
  get type() {
    return 'player';
  }
  static create(pos) {
    return new Player(pos.plus(new Vec(0, -0.5), new Vec(0, 0)));
  }
}
Player.prototype.size = new Vec(0.8, 1.5); //this could have been a method inside Player Class but it would waste Class creation space every time it's called

class Lava {
  constructor(pos, speed, reset) {
    this.pos = pos;
    this.speed = speed;
    this.reset = reset;
  }
  get type() {
    return 'lava';
  }
  static create(pos, ch) {
    if (ch == '=') {
      return new Lava(pos, new Vec(2, 0));
    } else if (ch == '|') {
      return new Lava(pos, new Vec(0, 2));
    } else if (ch == 'v') {
      return new Lava(pos, new Vec(0, 3), pos);
    }
  }
}
Lava.prototype.size = new Vec(1, 1);

class Coin {
  constructor(pos, basePos, wobble) {
    this.pos = pos;
    this.basePos = basePos;
    this.wobble = wobble;
  }
  get type() {
    return 'coin';
  }
  static create(pos) {
    let basePos = pos.plus(new Vec(0.2, 0.1));
    return new Coin(basePos, basePos, Math.random() * Math.PI * 2);
  }
}
Coin.prototype.size = new Vec(0.6, 0.6);

//check why eslint is taking o and v out of quotes....
const levelChars = {
  '.': 'empty',
  '#': 'wall',
  '+': 'lava',
  '@': Player,
  o: Coin,
  '=': Lava,
  '|': Lava,
  v: Lava,
};

let simpleLevel = new Level(simpleLevelPlan);
console.log(`${simpleLevel.width} by ${simpleLevel.height}`);
// → 22 by 9
console.dir(simpleLevel.startActors);
