/*
STRUCTURE: Powerplant
METHODS:
  action
  rechargeStructures
  checkForCharge
  updateTravelers
  reportCharge
SUBSTRUCTURES:
  Traveler
*/

var Powerplant = function (x, y) {
  game.grid[y][x].tenant = this;
  this.travelers = {};
  this.check = 0;
  this.type = 'powerplant';
  this.recharging = false;
  this.inventory = [];
  this.pos = {
    x: x,
    y: y,
  };
  this.cycle = 0;
  this.cycleLength = 100;
  this.rate = 1;
};

Powerplant.prototype.addToInventory = function (item) {
  var text;
  var time;
  this.inventory.push(item);
  if (!game.gotItemBefore) {
    text = "You found an item! You can study it further at a Research Station.";
    time = 7000;
  } else {
    text = "New item found.";
    time = 3000;
  }
  document.getElementsByClassName('textbox')[0].style.display = 'block';
  document.getElementsByClassName('textbox')[0].innerText = text;
  setTimeout(function () {
    document.getElementsByClassName('textbox')[0].innerText = "";
    document.getElementsByClassName('textbox')[0].style.display = 'none';
  }, time);
  game.gotItemBefore = true;
};

Powerplant.prototype.removeFromInventory = function (itemName) {
  var i;
  for (i=0 ; i<this.inventory.length ; i++) {
    if (this.inventory[i].name === itemName) {
      this.inventory.splice(i, 1);
    }
  }
};

Powerplant.prototype.action = function () {
  // Runs every frame, update attributes.
  var info;
  this.cycle += 1;
  if (this.recharging) {
    this.updateTravelers();
  }
  if (this.cycle > this.cycleLength) {
    this.cycle = 0;
    game.energy += this.rate;
    info = document.getElementById('menu-info');
    if (info && info.innerText.slice(0,12) === "Total Energy") {
      info.innerText = "Total Energy: " + game.energy + "ᴊ";
    }
    this.rechargeStructures();
  }
};

Powerplant.prototype.rechargeStructures = function () {
  // Begins the process of checking what structures are still connected
  // to the Powerplant
  var i;
  this.travelers = {};
  this.travelerCount = 0;
  this.recharging = true;
  for (i=0 ; i<game.structures.list.length ; i++) {
    if (game.structures.list[i].chargeable && !game.structures.list[i].charged) {
      game.structures.list[i].destroy();
    }
  }
  for (i=0 ; i<game.structures.list.length ; i++) {
    if (game.structures.list[i].chargeable) {
      game.structures.list[i].charged = false;
      this.checkForCharge(game.structures.list[i].pos, this.check);
    }
    this.check += 1;
  }
};

Powerplant.prototype.checkForCharge = function (pos) {
  // Create new Traveler object.
  this.travelers[this.travelerCount.toString()] = new Traveler (pos.x, pos.y, this.check, this.travelerCount.toString(), this);
};

Powerplant.prototype.updateTravelers = function () {
  // Move traveler objects along the process of navigating the tree.
  var i;
  var keys;
  keys = Object.keys(this.travelers);
  for (i=0 ; i<keys.length ; i++) {
    if (this.travelers[keys[i]]) {
      this.travelers[keys[i]].update();
    }
  }
};

Powerplant.prototype.reportCharge = function (pos) {
  // Confirm that a structure remains connected to the power grid.
  game.grid[pos.y][pos.x].tenant.charged = true;
};

var Traveler = function (x, y, check, id, parent, startPos) {
  // An object to help check whether a structure is connected by an unbroken
  // length of pipe back to the Power Plant.
  this.check = check;
  this.id = id;
  this.parent = parent;
  this.parent.travelerCount += 1;
  if (startPos) {
    this.startPos = startPos;
  } else {
    this.startPos = {
      x: x,
      y: y,
    };
  }
  this.pos = {
    x: x,
    y: y,
  };
};

Traveler.prototype.currentSquare = function () {
  // Return the Traveler's current square.
  return game.grid[this.pos.y][this.pos.x];
};

Traveler.prototype.surroundingSquares = function () {
  // Return an array of the four squares surrounding the Traveler. The
  // list will be shorter on an edge or corner square.
  return [
    game.grid[this.pos.y + 1] ? game.grid[this.pos.y + 1][this.pos.x] : undefined,
    game.grid[this.pos.y][this.pos.x + 1],
    game.grid[this.pos.y - 1] ? game.grid[this.pos.y - 1][this.pos.x] : undefined,
    game.grid[this.pos.y][this.pos.x - 1],
  ];
};

Traveler.prototype.update = function () {
  // Navigate the tree.
  var list;
  var pipeList;
  var pos;
  this.currentSquare().checks[this.check] = true;
  if (this.currentSquare().type === 'powerplant') {
    this.parent.reportCharge(this.startPos);
    this.destroy();
  }
  list = this.surroundingSquares();
  pipeList = [];
  for (i=0 ; i<list.length ; i++) {
    if (game.tileData[list[i].type].pipeable && !list[i].checks[this.check]) {
      pipeList.push(list[i]);
    }
  }
  if (pipeList.length === 1) {
    this.pos.x = pipeList[0].pos.x;
    this.pos.y = pipeList[0].pos.y;
  } else if (pipeList.length > 1) {
    this.pos.x = pipeList[0].pos.x;
    this.pos.y = pipeList[0].pos.y;
    for (i=1 ; i<pipeList.length ; i++) {
      pos = pipeList[i].pos;
      this.parent.travelers[this.parent.travelerCount.toString()] = new Traveler (pos.x, pos.y, this.check, this.parent.travelerCount.toString(), this.parent, this.startPos);
    }
  } else {
    if (this.currentSquare().type !== 'powerplant') {
      this.destroy();
    }
  }
};

Traveler.prototype.destroy = function () {
  // Remove self from parent's list of travelers.
  this.parent.travelers[this.id] = false;
};
