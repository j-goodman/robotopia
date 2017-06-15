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
  game.grid[y][x].tenant = this;
  this.pos = {
    x: x,
    y: y,
  };
  this.cycle = 0;
  this.cycleLength = 100;
  this.rate = 1;
};

Powerplant.prototype.action = function () {
  var info;
  this.cycle += 1;
  if (this.cycle > this.cycleLength) {
    this.cycle = 0;
    game.energy += this.rate;
    info = document.getElementById('menu-info');
    if (info && info.innerText.slice(0,12) === "Total Energy") {
      info.innerText = "Total Energy: " + game.energy + "ᴊ";
    }
  }
};

var Pipe = function (x, y) {
  game.grid[y][x].tenant = this;
  this.pos = {
    x: x,
    y: y,
  };
};

var Deposit = function (x, y) {
  this.pos = {
    x: x,
    y: y,
  };
  this.energy = Math.round(Math.random() * 175 + 25);
};

Deposit.prototype.destroy = function () {
  var i;
  game.grid[this.pos.y][this.pos.x].type = 'empty';
  for (i=0 ; i<game.structures.list.length ; i++) {
    if (game.structures.list[i] === this) {
      game.structures.list.splice(i, 1);
    }
  }
  game.organ.play('flush');
};

var SalvageCamp = function (x, y) {
  game.grid[y][x].tenant = this;
  this.cycle = 0;
  this.cycleLength = 180;
  this.pos = {
    x: x,
    y: y,
  };
  this.detectResources();
};

SalvageCamp.prototype.action = function () {
  var i;
  this.cycle += 1;
  if (this.cycle > this.cycleLength) {
    this.cycle = 0;
    for (i=0 ; i<this.resources.length ; i++) {
      if (this.resources[i].energy > 0) {
        game.energy += 1;
        this.resources[i].energy -= 1;
      } else {
        this.resources[i].destroy();
        this.detectResources();
      }
    }
    info = document.getElementById('menu-info');
    if (info && info.innerText.slice(0,17) === "Energy in Deposit" && this === game.menuSubject) {
      info.innerText = "Energy in Deposit: " + this.energyLeft() + "ᴊ";
    } else if (info && info.innerText.slice(0,12) === "Total Energy") {
      info.innerText = "Total Energy: " + game.energy + "ᴊ";
    }
  }
};

SalvageCamp.prototype.energyLeft = function () {
  var i;
  var sum;
  sum = 0;
  for (i=0 ; i<this.resources.length ; i++) {
    sum += this.resources[i].energy;
  }
  return sum;
};

SalvageCamp.prototype.detectResources = function () {
  this.resources = [];
    if (game.grid[this.pos.y + 1][this.pos.x].type === 'deposit') {
    this.resources.push(game.grid[this.pos.y + 1][this.pos.x].tenant);
  } if (game.grid[this.pos.y - 1][this.pos.x].type === 'deposit') {
    this.resources.push(game.grid[this.pos.y - 1][this.pos.x].tenant);
  } if (game.grid[this.pos.y][this.pos.x + 1].type === 'deposit') {
    this.resources.push(game.grid[this.pos.y][this.pos.x + 1].tenant);
  } if (game.grid[this.pos.y][this.pos.x - 1].type === 'deposit') {
    this.resources.push(game.grid[this.pos.y][this.pos.x - 1].tenant);
  }
};

structures.lookup = {
  'powerplant': Powerplant,
  'pipe': Pipe,
  'deposit': Deposit,
  'salvageCamp': SalvageCamp,
};
