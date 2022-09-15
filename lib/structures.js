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
  this.energy = Math.round(Math.random() * 280 + 70);
  this.totalEnergy = this.energy
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
  game.tappedEnergy -= this.totalEnergy - this.energy
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
  game.grid[y][x].type = 'contaminator';
  this.type = 'contaminator';
  this.chargeable = true;
  this.charged = true;
  this.interval = 200;
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
  } else if (this.cycle === Math.floor(this.interval * 4)) {
    for (y = 0; y < game.grid.length; y++) {
      for (x = 0; x < game.grid.length; x++) {
        let distance = distanceBetween(this.pos, {x: x, y: y})
        if (distance < 4 && distance > 2) {
          game.grid[y][x].poisoned = true
        }
      }
    }
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
  this.cycleLength = 200;
  this.pos = {
    x: x,
    y: y,
  };
  this.detectResources();
  this.destructionSound = 'blast';
  this.originalTappedEnergy = this.energyLeft()
  game.tappedEnergy += this.originalTappedEnergy
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
          this.resources[i].energy -= 2;
        } else {
          game.energy += 2;
          this.resources[i].energy -= 2;
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
    if (this.geoharvester) {
      game.organ.play('twang')
      game.mainPowerplant.addToInventory(new Item ('geoharvester'))
    } else {
      game.organ.play('machinebuild');
      this.geoharvester = true;
      this.detectResources();
    }
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
    this.specialBuilds = ['superDestroyer', 'munitionsFactory', 'militaryChemicalPlant'];
  } else if (upgradeTo === 'civilian') {
    this.specialBuilds = ['precisionDestroyer', 'civilianChemicalPlant', 'nuclearResearchStation'];
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

var NuclearResearchStation = function (x, y) {
  this.type = 'nuclearResearchStation';
  this.chargeable = true;
  this.charged = true;
  game.grid[y][x].tenant = this;
  this.specialty = 'civilian';
  this.pos = {
    x: x,
    y: y,
  };
  this.destructionSound = 'blast';
};

NuclearResearchStation.prototype.examineItems = ResearchStation.prototype.examineItems
NuclearResearchStation.prototype.itemDetail = ResearchStation.prototype.itemDetail
NuclearResearchStation.prototype.destroy = Deposit.prototype.destroy;

var FusionReactor = function (x, y) {
  this.type = 'fusionReactor';
  this.chargeable = true;
  this.charged = true;
  game.grid[y][x].tenant = this;
  this.pos = {
    x: x,
    y: y,
  };
  this.destructionSound = 'blast';
  game.fusionReactors += 1;
  setTimeout(() => {
      builder.builds.fusionReactor.cost = 100 + game.fusionReactors * 100;
  }, 250)
};

FusionReactor.prototype.meltdown = function () {
    let plasma
    let x
    let y
    for (y = 0; y < game.grid.length; y++) {
      for (x = 0; x < game.grid.length; x++) {
        let distance = distanceBetween(this.pos, {x: x, y: y})
        if (distance < 8) {
          setTimeout(function (x, y) {
              game.grid[y][x].poisoned = true
          }.bind(null, x, y), distance * 100)
        }
        if (distance < 5 && distance >= 1) {
            setTimeout(function (x, y) {
                destroySquare(x, y)
            }.bind(null, x, y), distance * 200)
        }
      }
    }
}

FusionReactor.prototype.onDestroy = function () {
    game.fusionReactors -= 1
    builder.builds.fusionReactor.cost = 100 + game.fusionReactors * 100;
    this.meltdown()
}

FusionReactor.prototype.destroy = Deposit.prototype.destroy

var MunitionsFactory = function (x, y) {
  this.type = 'munitionsFactory';
  this.chargeable = true;
  this.charged = true;
  game.grid[y][x].tenant = this;
  this.itemCosts = {
      triggerpin: 20,
      geoharvester: 50,
      plasmabomb: 200,
  }
  this.pos = {
    x: x,
    y: y,
  };
  this.destructionSound = 'blast';
};

MunitionsFactory.prototype.manufactureItems = function () {
  var content;
  var element;
  var i;
  content = document.getElementById('menu-list');
  content.innerHTML = "";
  let itemTags = Object.keys(this.itemCosts)
  for (i=0 ; i<itemTags.length ; i++) {
    element = document.createElement('LI');
    element.innerText = `${game.itemData[itemTags[i]].name}: ${this.itemCosts[itemTags[i]]}ᴊ`;
    element.onclick = this.manufacture.bind(this, itemTags[i], this.itemCosts[itemTags[i]], element);
    content.appendChild(element);
  }
  element = document.createElement('LI');
  element.innerText = "×";
  element.onclick = menus.hideMenu;
  content.appendChild(element);
};

MunitionsFactory.prototype.manufacture = function (itemTag, cost, button) {
  if (game.energy >= this.itemCosts[itemTag]) {
    game.energy -= this.itemCosts[itemTag]
    game.mainPowerplant.addToInventory(new Item (itemTag))
    organ.play('unsheath')
  } else {
    button.innerText = "That's too expensive."
  }
}

MunitionsFactory.prototype.examineItems = ResearchStation.prototype.examineItems
MunitionsFactory.prototype.itemDetail = ResearchStation.prototype.itemDetail
MunitionsFactory.prototype.destroy = Deposit.prototype.destroy

structures.lookup = {
  'boulder': Boulder,
  'contaminator': Contaminator,
  'chemicalPlant': ChemicalPlant,
  'deposit': Deposit,
  'destroyer': Destroyer,
  'extractor': Extractor,
  'fusionReactor': FusionReactor,
  'munitionsFactory': MunitionsFactory,
  'nuclearResearchStation': NuclearResearchStation,
  'pipe': Pipe,
  'plasma': Plasma,
  'powerplant': Powerplant,
  'researchStation': ResearchStation,
  'root': Root,
  'rootflower': Rootflower,
  'shipwreck': Shipwreck,
  'strangler': Strangler,
};
