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
  this.type = 'powerplant';
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
  this.type = 'pipe';
  this.pos = {
    x: x,
    y: y,
  };
};

var Deposit = function (x, y) {
  this.type = 'deposit';
  this.checkToEnsconce = false;
  this.pos = {
    x: x,
    y: y,
  };
  this.energy = Math.round(Math.random() * 175 + 25);
};

Deposit.prototype.action = function () {
  if (!this.checkToEnsconce && !Math.floor(Math.random() * game.settings.boulderRarity)) {
    this.ensconce();
  }
  this.checkToEnsconce = true;
  this.action = null;
};

Deposit.prototype.destroy = function () {
  var i;
  game.grid[this.pos.y][this.pos.x].type = 'empty';
  for (i=0 ; i<game.structures.list.length ; i++) {
    if (game.structures.list[i] === this) {
      game.structures.list.splice(i, 1);
    }
  }
  if (this.onDestroy) {
    this.onDestroy();
  }
  game.organ.play('flush');
};

Deposit.prototype.onDestroy = function () {
  var i;
  for (i=0 ; i<game.structures.list.length ; i++) {
    if (game.structures.list[i].type === 'salvageCamp') {
      game.structures.list[i].detectResources();
    }
  }
};

Deposit.prototype.ensconce = function () {
  var boulder;
  var plantBoulder;
  plantBoulder = function (xPlus, yPlus) {
    if (game.grid[this.pos.y + yPlus][this.pos.x + xPlus].type === 'empty') {
      boulder = new game.structures.lookup.boulder (this.pos.x + xPlus, this.pos.y + yPlus);
      game.structures.push(boulder);
      game.grid[this.pos.y + yPlus][this.pos.x + xPlus].type = 'boulder';
    }
  }.bind(this);
  plantBoulder(1, 0);
  plantBoulder(-1, 0);
  plantBoulder(0, 1);
  plantBoulder(0, -1);
  if (!Math.floor(Math.random() * 2)) { plantBoulder(-1, -1); }
  if (!Math.floor(Math.random() * 2)) { plantBoulder(1, -1); }
  if (!Math.floor(Math.random() * 2)) { plantBoulder(1, 1); }
  if (!Math.floor(Math.random() * 2)) { plantBoulder(-1, 1); }
};

var Destroyer = function (x, y) {
  game.grid[y][x].tenant = this;
  this.type = 'destroyer';
  this.modifier = false;
  this.angle = Math.floor(Math.random() * 4); // 0 represents up, 1 is right, etc.
  this.range = 6;
  this.pos = {
    x: x,
    y: y,
  };
};

Destroyer.prototype.rotate = function () {
  this.angle += 1;
  this.angle = this.angle > 3 ? 0 : this.angle;
  game.organ.play('roll');
};

Destroyer.prototype.fire = function () {
  game.organ.play('blast');
  var direction;
  var i;
  var place;
  var plasma;
  direction = {
    x: 0,
    y: 0,
  };
  place = {
    x: 0,
    y: 0,
  };
  menus.hideMenu();
  if (this.angle === 0) { direction.y = -1; }
  if (this.angle === 1) { direction.x = 1; }
  if (this.angle === 2) { direction.y = 1; }
  if (this.angle === 3) { direction.x = -1; }
  for (i=1 ; i<this.range ; i++) {
    setTimeout(function () {
      place.x += direction.x;
      place.y += direction.y;
      if (['empty', 'deposit', 'boulder'].includes(game.grid[this.pos.y + place.y][this.pos.x + place.x].type)) {
        if (
          game.grid[this.pos.y + place.y] &&
          game.grid[this.pos.y + place.y][this.pos.x + place.x] &&
          game.grid[this.pos.y + place.y][this.pos.x + place.x].tenant &&
          game.grid[this.pos.y + place.y][this.pos.x + place.x].tenant.destroy
        ) {
          game.grid[this.pos.y + place.y][this.pos.x + place.x].tenant.destroy();
        }
        plasma = new game.structures.lookup.plasma (this.pos.x + place.x, this.pos.y + place.y);
        game.structures.push(plasma);
        game.grid[this.pos.y + place.y][this.pos.x + place.x].type = 'plasma';
      } else if (game.grid[this.pos.y + place.y][this.pos.x + place.x].type === 'pipe') {
        var doNothing;
      } else {
        return false;
      }
    }.bind(this), 80 * i);
  }
};

Destroyer.prototype.selfDestruct = function () {
  game.organ.play('blast');
  this.destroy();
};

Destroyer.prototype.onDestroy = function () {
  var pipe;
  var pipes;
  pipes = 0;
  if (game.grid[this.pos.y + 1][this.pos.x].type === 'pipe') { pipes += 1; }
  if (game.grid[this.pos.y][this.pos.x + 1].type === 'pipe') { pipes += 1; }
  if (game.grid[this.pos.y - 1][this.pos.x].type === 'pipe') { pipes += 1; }
  if (game.grid[this.pos.y][this.pos.x - 1].type === 'pipe') { pipes += 1; }
  if (pipes > 1) {
    pipe = new game.structures.lookup.pipe (this.pos.x, this.pos.y);
    game.structures.push(pipe);
    game.grid[this.pos.y][this.pos.x].type = 'pipe';
  }
};

Destroyer.prototype.destroy = Deposit.prototype.destroy;

var Boulder = function (x, y) {
  this.type = 'boulder';
  this.pos = {
    x: x,
    y: y,
  };
};

Boulder.prototype.destroy = Deposit.prototype.destroy;

var Plasma = function (x, y) {
  this.type = 'plasma';
  game.grid[y][x].tenant = this;
  this.pos = {
    x: x,
    y: y,
  };
  this.timeLeft = 12;
};

Plasma.prototype.action = function () {
  this.timeLeft -= 1;
  if (this.timeLeft < 0) {
    this.destroy();
  }
};

Plasma.prototype.destroy = Deposit.prototype.destroy;

var SalvageCamp = function (x, y) {
  this.type = 'salvageCamp';
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
      if (!this.resources[i]) {
        console.log(i);
        console.log(this.resources);
      }
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

var ResearchStation = function (x, y) {
  this.type = 'researchStation';
  game.grid[y][x].tenant = this;
  this.specialty = 'basic';
  this.specialBuilds = false;
  this.pos = {
    x: x,
    y: y,
  };
};

ResearchStation.prototype.upgrade = function (upgradeTo) {
  var sound;
  this.specialty = upgradeTo;
  if (upgradeTo === 'military') {
    this.specialBuilds = ['superDestroyer'];
  }
  sound = upgradeTo === 'military' ? 'unsheath' : 'woodassemble';
  game.organ.play(sound);
  menus.hideMenu();
};

structures.lookup = {
  'boulder': Boulder,
  'deposit': Deposit,
  'destroyer': Destroyer,
  'pipe': Pipe,
  'plasma': Plasma,
  'powerplant': Powerplant,
  'researchStation': ResearchStation,
  'salvageCamp': SalvageCamp,
};
