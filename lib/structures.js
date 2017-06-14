/*
STRUCTURES.JS
Keeps track of structures in the game and defines what types of structures
can be put into tiles.
*/

var structures = {
  list: [],
};

structures.push = function (item) {
  this.list.push(item);
};

structures.act = function () {
  var i;
  if (!this.list.length) { return false; }
  for (i=0 ; i<this.list.length ; i++) {
    if (this.list[i].action) {
      this.list[i].action();
    }
  }
};

var Powerplant = function (x, y) {
  this.pos = {
    x: x,
    y: y,
  };
  this.cycle = 0;
  this.cycleLength = 120;
};

Powerplant.prototype.action = function () {
  var info;
  this.cycle += 1;
  if (this.cycle > this.cycleLength) {
    this.cycle = 0;
    game.energy += 1;
    info = document.getElementById('menu-info');
    if (info && info.innerText.slice(0,7) === "Energy:") {
      info.innerText = "Energy: " + game.energy + "ᴊ";
    }
  }
};

var Pipe = function (x, y) {
  this.pos = {
    x: x,
    y: y,
  };
};

structures.lookup = {
  'powerplant': Powerplant,
  'pipe': Pipe,
};
