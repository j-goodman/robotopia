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
Destroyer.prototype.destroy = Deposit.prototype.destroy;
Rootflower.prototype.destroy = Pipe.prototype.destroy;
Strangler.prototype.destroy = Pipe.prototype.destroy;

var Contaminator = function (x, y) {
  game.grid[y][x].tenant = this;
  this.type = 'contaminator';
  this.chargeable = true;
  this.charged = true;
  this.interval = 500;
  this.cycle = this.interval - 100;
  this.modifier = false;
  this.pos = {
    x: x,
    y: y,
  };
  this.destructionSound = 'plunk';
};

Contaminator.prototype.action = function () {
  this.cycle += 1;
  if (this.cycle === this.interval * 1) {
    game.organ.play('poison');
    game.grid[this.pos.y][this.pos.x].poisoned = true;
    game.grid[this.pos.y + 1][this.pos.x].poisoned = true;
    game.grid[this.pos.y - 1][this.pos.x].poisoned = true;
    game.grid[this.pos.y][this.pos.x + 1].poisoned = true;
    game.grid[this.pos.y][this.pos.x - 1].poisoned = true;
  } else if (this.cycle === this.interval * 2) {
    game.organ.play('poison');
    game.grid[this.pos.y + 2][this.pos.x].poisoned = true;
    game.grid[this.pos.y - 2][this.pos.x].poisoned = true;
    game.grid[this.pos.y][this.pos.x + 2].poisoned = true;
    game.grid[this.pos.y][this.pos.x - 2].poisoned = true;
    game.grid[this.pos.y + 1][this.pos.x + 1].poisoned = true;
    game.grid[this.pos.y + 1][this.pos.x - 1].poisoned = true;
    game.grid[this.pos.y - 1][this.pos.x - 1].poisoned = true;
    game.grid[this.pos.y - 1][this.pos.x + 1].poisoned = true;
  } else if (this.cycle === this.interval * 3) {
    game.organ.play('poison');
    game.grid[this.pos.y - 1][this.pos.x - 2].poisoned = true;
    game.grid[this.pos.y - 2][this.pos.x - 1].poisoned = true;
    game.grid[this.pos.y - 2][this.pos.x + 1].poisoned = true;
    game.grid[this.pos.y - 1][this.pos.x + 2].poisoned = true;
    game.grid[this.pos.y + 1][this.pos.x + 2].poisoned = true;
    game.grid[this.pos.y + 2][this.pos.x + 1].poisoned = true;
    game.grid[this.pos.y + 2][this.pos.x - 1].poisoned = true;
    game.grid[this.pos.y + 1][this.pos.x - 2].poisoned = true;
  } else if (this.cycle === this.interval * 6) {
    this.destroy();
  }
};

Contaminator.prototype.destroy = Deposit.prototype.destroy;

var Boulder = function (x, y) {
  this.type = 'boulder';
  this.energy = Math.round(Math.random() * 85 + 15);
  this.pos = {
    x: x,
    y: y,
  };
};

Boulder.prototype.destroy = Deposit.prototype.destroy;

var Shipwreck = function (x, y) {
  var items;
  items = ['triggerpin', 'plasmabomb', 'geoharvester'];
  this.type = 'shipwreck';
  this.contents = [new Item (items[Math.floor(Math.random() * items.length)])];
  this.pos = {
    x: x,
    y: y,
  };
};

Shipwreck.prototype.destroy = Deposit.prototype.destroy;

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
  this.geoharvester = false;
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
      if (this.resources[i].type === 'deposit' || this.resources[i].type === 'boulder') {
        if (this.resources[i].energy > 1) {
          game.energy += 1;
          this.resources[i].energy -= 1;
        } else {
          game.energy += 1;
          this.resources[i].energy -= 1;
          this.resources[i].destroy();
          this.detectResources();
        }
      } else if (this.resources[i].type === 'shipwreck') {
        if (this.resources[i].contents.length) {
          game.mainPowerplant.addToInventory(this.resources[i].contents.splice(0, 1)[0]);
        }
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
    if (this.resources[i].energy) {
      sum += this.resources[i].energy;
    }
  }
  return sum;
};

Extractor.prototype.apply = function (item) {
  if (item.tag === 'geoharvester') {
    game.organ.play('machinebuild');
    this.geoharvester = true;
    this.detectResources();
  }
};

Extractor.prototype.removeGeoharvester = function () {
  if (this.geoharvester) {
    this.geoharvester = false;
    this.detectResources();
    game.mainPowerplant.addToInventory(new Item ('geoharvester'));
    menus.hideMenu();
  }
};

Extractor.prototype.detectResources = function () {
  var viableSources;
  viableSources = ['deposit', 'shipwreck'];
  if (this.geoharvester) {
    viableSources = ['deposit', 'shipwreck', 'boulder']
  }
  this.resources = [];
    if (viableSources.includes(game.grid[this.pos.y + 1][this.pos.x].type)) {
    this.resources.push(game.grid[this.pos.y + 1][this.pos.x].tenant);
  } if (viableSources.includes(game.grid[this.pos.y - 1][this.pos.x].type)) {
    this.resources.push(game.grid[this.pos.y - 1][this.pos.x].tenant);
  } if (viableSources.includes(game.grid[this.pos.y][this.pos.x + 1].type)) {
    this.resources.push(game.grid[this.pos.y][this.pos.x + 1].tenant);
  } if (viableSources.includes(game.grid[this.pos.y][this.pos.x - 1].type)) {
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

ResearchStation.prototype.examineItems = function () {
  var content;
  var element;
  var i;
  content = document.getElementById('menu-list');
  if (game.mainPowerplant.inventory.length === 0) {
    content.innerText = "You don't have any items in your inventory.";
  } else {
    content.innerHTML = "";
    for (i=0 ; i<game.mainPowerplant.inventory.length ; i++) {
      element = document.createElement('LI');
      element.innerText = game.itemData[game.mainPowerplant.inventory[i].tag].name;
      element.onclick = this.itemDetail.bind(null, content, game.mainPowerplant.inventory[i]);
      content.appendChild(element);
    }
  }
  element = document.createElement('LI');
  element.innerText = "×";
  element.onclick = menus.hideMenu;
  content.appendChild(element);
};

ResearchStation.prototype.itemDetail = function (content, item) {
  var element;
  content.innerHTML = "";
  element = document.createElement('LI');
  element.innerText = "Use " + game.itemData[item.tag].name;
  element.onclick = item.use.bind(item);
  content.appendChild(element);
  element = document.createElement('LI');
  element.innerText = game.itemData[item.tag].description;
  element.className = 'non-select';
  content.appendChild(element);
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
  'shipwreck': Shipwreck,
  'strangler': Strangler,
};
