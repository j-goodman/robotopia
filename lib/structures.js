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

var Deposit = function (x, y) {
  this.type = 'deposit';
  this.checkToEnsconce = false;
  this.pos = {
    x: x,
    y: y,
  };
  this.energy = Math.round(Math.random() * 175 + 25);
  this.destructionSound = 'flush';
};

Deposit.prototype.action = function () {
  if (!this.checkToEnsconce && !Math.floor(Math.random() * game.settings.boulderRarity)) {
    // this.ensconce();
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
  if (this.destructionSound) {
    game.organ.play(this.destructionSound);
  }
};

Deposit.prototype.onDestroy = function () {
  var i;
  for (i=0 ; i<game.structures.list.length ; i++) {
    if (game.structures.list[i].type === 'extractor') {
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

var Pipe = function (x, y) {
  game.grid[y][x].tenant = this;
  this.type = 'pipe';
  this.pos = {
    x: x,
    y: y,
  };
  this.destructionSound = 'plunk';
};

Pipe.prototype.destroy = Deposit.prototype.destroy;
Root.prototype.destroy = Pipe.prototype.destroy;
Strangler.prototype.destroy = Pipe.prototype.destroy;

var Contaminator = function (x, y) {
  game.grid[y][x].tenant = this;
  this.age = 0;
  this.type = 'contaminator';
  this.chargeable = true;
  this.charged = true;
  this.modifier = false;
  this.pos = {
    x: x,
    y: y,
  };
  this.destructionSound = 'plunk';
};

Contaminator.prototype.action = function () {
  var interval;
  interval = 300;
  this.age += 1;
  if (this.age === interval * 1) {
    game.organ.play('poison');
    game.grid[this.pos.y][this.pos.x].poisoned = true;
    game.grid[this.pos.y + 1][this.pos.x].poisoned = true;
    game.grid[this.pos.y - 1][this.pos.x].poisoned = true;
    game.grid[this.pos.y][this.pos.x + 1].poisoned = true;
    game.grid[this.pos.y][this.pos.x - 1].poisoned = true;
  } else if (this.age === interval * 2) {
    game.organ.play('poison');
    game.grid[this.pos.y + 2][this.pos.x].poisoned = true;
    game.grid[this.pos.y - 2][this.pos.x].poisoned = true;
    game.grid[this.pos.y][this.pos.x + 2].poisoned = true;
    game.grid[this.pos.y][this.pos.x - 2].poisoned = true;
    game.grid[this.pos.y + 1][this.pos.x + 1].poisoned = true;
    game.grid[this.pos.y + 1][this.pos.x - 1].poisoned = true;
    game.grid[this.pos.y - 1][this.pos.x - 1].poisoned = true;
    game.grid[this.pos.y - 1][this.pos.x + 1].poisoned = true;
  } else if (this.age === interval * 3) {
    game.organ.play('poison');
    game.grid[this.pos.y - 1][this.pos.x - 2].poisoned = true;
    game.grid[this.pos.y - 2][this.pos.x - 1].poisoned = true;
    game.grid[this.pos.y - 2][this.pos.x + 1].poisoned = true;
    game.grid[this.pos.y - 1][this.pos.x + 2].poisoned = true;
    game.grid[this.pos.y + 1][this.pos.x + 2].poisoned = true;
    game.grid[this.pos.y + 2][this.pos.x + 1].poisoned = true;
    game.grid[this.pos.y + 2][this.pos.x - 1].poisoned = true;
    game.grid[this.pos.y + 1][this.pos.x - 2].poisoned = true;
  } else if (this.age === interval * 6) {
    this.destroy();
  }
};

Contaminator.prototype.destroy = Deposit.prototype.destroy;

var Destroyer = function (x, y) {
  game.grid[y][x].tenant = this;
  this.type = 'destroyer';
  this.chargeable = true;
  this.charged = true;
  this.modifier = false;
  this.angle = 1;
  this.range = 6;
  this.pos = {
    x: x,
    y: y,
  };
  this.destructionSound = 'blast';
};

Destroyer.prototype.rotate = function () {
  this.angle += 1;
  this.angle = this.angle > 3 ? 0 : this.angle;
  game.organ.play('roll');
};

Destroyer.prototype.fire = function () {
  game.organ.play('blast');
  this.destroyableStructures = ['empty', 'deposit', 'boulder', 'pipe', 'extractor', 'researchStation', 'destroyer', 'rootflower', 'root', 'strangler', 'chemicalPlant'];
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
  for (i=1 ; i<this.range+1 ; i++) {
    setTimeout(function () {
      place.x += direction.x;
      place.y += direction.y;
      if (this.destroyableStructures.includes(game.grid[this.pos.y + place.y][this.pos.x + place.x].type)) {
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

Destroyer.prototype.adjustRange = function (element) {
  if (this.modifier === 'precisionDestroyer') {
    this.range -= 1;
    if (this.range === 0) {
      this.range = 5;
    }
    element.innerText = "Adjust Range [" + this.range + "]";
  }
};

Destroyer.prototype.selfDestruct = function () {
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

var Extractor = function (x, y) {
  this.type = 'extractor';
  this.chargeable = true;
  this.charged = true;
  game.grid[y][x].tenant = this;
  this.cycle = 0;
  this.cycleLength = 180;
  this.pos = {
    x: x,
    y: y,
  };
  this.detectResources();
  this.destructionSound = 'blast';
};

Extractor.prototype.destroy = Deposit.prototype.destroy;

Extractor.prototype.action = function () {
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

Extractor.prototype.energyLeft = function () {
  var i;
  var sum;
  sum = 0;
  for (i=0 ; i<this.resources.length ; i++) {
    sum += this.resources[i].energy;
  }
  return sum;
};

Extractor.prototype.detectResources = function () {
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

var ChemicalPlant = function (x, y) {
  this.type = 'chemicalPlant';
  this.chargeable = true;
  this.charged = true;
  game.grid[y][x].tenant = this;
  this.civilianBuilds = ['superExtractor'];
  this.militaryBuilds = ['contaminator'];
  this.pos = {
    x: x,
    y: y,
  };
  this.destructionSound = 'blast';
};

ChemicalPlant.prototype.destroy = Deposit.prototype.destroy;

var ResearchStation = function (x, y) {
  this.type = 'researchStation';
  this.chargeable = true;
  this.charged = true;
  game.grid[y][x].tenant = this;
  this.specialty = 'basic';
  this.specialBuilds = false;
  this.pos = {
    x: x,
    y: y,
  };
  this.destructionSound = 'blast';
};

ResearchStation.prototype.upgrade = function (upgradeTo) {
  var sound;
  this.specialty = upgradeTo;
  if (upgradeTo === 'military') {
    this.specialBuilds = ['superDestroyer', 'militaryChemicalPlant'];
  } else if (upgradeTo === 'civilian') {
    this.specialBuilds = ['precisionDestroyer', 'civilianChemicalPlant'];
  }
  sound = upgradeTo === 'military' ? 'unsheath' : 'woodassemble';
  game.organ.play(sound);
  menus.hideMenu();
};

ResearchStation.prototype.destroy = Deposit.prototype.destroy;

structures.lookup = {
  'boulder': Boulder,
  'contaminator': Contaminator,
  'chemicalPlant': ChemicalPlant,
  'deposit': Deposit,
  'destroyer': Destroyer,
  'extractor': Extractor,
  'pipe': Pipe,
  'plasma': Plasma,
  'powerplant': Powerplant,
  'researchStation': ResearchStation,
  'root': Root,
  'rootflower': Rootflower,
  'strangler': Strangler,
};
