/*
STRUCTURE: Rootflower
METHODS:
  action
  extendRoots
OTHER STRUCTURES:
  Root
  Roothead
*/

var Rootflower = function (x, y) {
  game.grid[y][x].tenant = this;
  this.travelers = {};
  this.rootheads = {};
  this.rootheadCount = 0;
  this.check = 0;
  this.type = 'powerplant';
  this.recharging = false;
  this.pos = {
    x: x,
    y: y,
  };
  this.cycle = 0;
  this.cycleLength = 100;
  this.macroCycle = 10;
  this.macroCycleLength = 10;
};

Rootflower.prototype.action = function () {
  // Runs every frame, update attributes.
  var info;
  this.cycle += 1;
  if (this.recharging) {
    this.updateTravelers();
  }
  if (this.cycle > this.cycleLength) {
    this.cycle = 0;
    this.macroCycle += 1;
    info = document.getElementById('menu-info');
    if (info && info.innerText.slice(0,12) === "Total Energy") {
      info.innerText = "Total Energy: " + game.energy + "ᴊ";
    }
    this.extendRoots();
  }
  if (this.macroCycle > this.macroCycleLength) {
    this.macroCycle = 0;
    this.rootheads[this.rootheadCount] = new Roothead (this, this.rootheadCount, this.pos.x, this.pos.y);
    this.rootheadCount += 1;
  }
};

Rootflower.prototype.extendRoots = function () {
  var i;
  for (i=0 ; i<=this.rootheadCount ; i++) {
    if (this.rootheads[i]) {
      this.rootheads[i].action();
    }
  }
};

var Roothead = function (parent, id, x, y) {
  // Functions similarly to the player's cursor object, moving through the map
  // and placing structures for the Rootflower. The main difference is that
  // each Rootflower can have many of these.
  this.parent = parent;
  this.id = id;
  this.failures = 0;
  this.direction = Math.floor(Math.random() * 4);
  //     (0) ^
  //   (3) <-X-> (1)
  //         v (2)
  this.pos = {
    x: x,
    y: y,
  };
};

Roothead.prototype.action = function () {
  var object;
  var xMove; var yMove;
  xMove = 0;
  yMove = 0;

  if (!Math.floor(Math.random() * 6)) { // One in six chance
    this.direction += Math.round(Math.random()) ? 1 : -1;
  }

  if (!['root', 'rootflower'].includes(game.grid[this.pos.y][this.pos.x].type)) {
    this.destroy();
  }

  if (this.direction === 0) { yMove = -1; }
  if (this.direction === 1) { xMove = 1; }
  if (this.direction === 2) { yMove = 1; }
  if (this.direction === 3) { xMove = -1; }

  if (game.grid[this.pos.y + yMove][this.pos.x + xMove].type === 'empty') {
    object = new game.structures.lookup.root (this.pos.x + xMove, this.pos.y + yMove);
    game.structures.push(object);
    game.grid[this.pos.y + yMove][this.pos.x + xMove].tenant = object;
    game.grid[this.pos.y + yMove][this.pos.x + xMove].type = 'root';
    this.pos.x += xMove;
    this.pos.y += yMove;
    this.failures = 0;
    game.organ.playIfVisible(this.pos, 'crawl');
  } else {
    this.direction += 1;
    this.failures += 1;
  }

  this.direction = this.direction > 3 ? this.direction = 0 : this.direction;
  this.direction = this.direction < 0 ? this.direction = 3 : this.direction;

  if (this.failures > 6) {
    this.destroy();
  }
};

Roothead.prototype.destroy = function () {
  this.parent.rootheads[this.id] = undefined;
};

var Root = function (x, y) {
  game.grid[y][x].tenant = this;
  this.type = 'root';
  this.cycle = 0;
  this.cycleLength = 500;
  this.pos = {
    x: x,
    y: y,
  };
};

var Strangler = function (x, y) {
  game.grid[y][x].tenant = this;
  this.type = 'strangler';
  this.cycle = 0;
  this.cycleLength = 500 + (Math.random() * 3000);
  this.pos = {
    x: x,
    y: y,
  };
};

Strangler.prototype.action = function () {
  this.cycle += 1;
  if (this.cycle > this.cycleLength) {
    this.destroy();
    object = new game.structures.lookup.root (this.pos.x, this.pos.y);
    game.structures.push(object);
    game.grid[this.pos.y][this.pos.x].tenant = object;
    game.grid[this.pos.y][this.pos.x].type = 'root';
  }
  if (this.cycle % 20 === 0) {
    if (
      !game.tileData[game.grid[this.pos.y + 1][this.pos.x].type].rootable &&
      !game.tileData[game.grid[this.pos.y - 1][this.pos.x].type].rootable &&
      !game.tileData[game.grid[this.pos.y][this.pos.x + 1].type].rootable &&
      !game.tileData[game.grid[this.pos.y][this.pos.x - 1].type].rootable
    ) {
      this.destroy();
      object = new game.structures.lookup.pipe (this.pos.x, this.pos.y);
      game.structures.push(object);
      game.grid[this.pos.y][this.pos.x].tenant = object;
      game.grid[this.pos.y][this.pos.x].type = 'pipe';
    }
  }
};

Root.prototype.action = function () {
  var object;
  var xPlus; var yPlus;
  this.cycle += 1;
  if (this.cycle > this.cycleLength) {
    this.cycle = 0;
    if (
        game.grid[this.pos.y + 1][this.pos.x].type === 'empty' ||
        game.grid[this.pos.y][this.pos.x + 1].type === 'empty' ||
        game.grid[this.pos.y - 1][this.pos.x].type === 'empty' ||
        game.grid[this.pos.y][this.pos.x - 1].type === 'empty'
       ) {
      if (!Math.floor(Math.random() * 24)) { // One in twenty-four chance
        this.destroy();
        object = new game.structures.lookup.rootflower (this.pos.x, this.pos.y);
        game.structures.push(object);
        game.grid[this.pos.y][this.pos.x].tenant = object;
        game.grid[this.pos.y][this.pos.x].type = 'rootflower';
        game.organ.playIfVisible(this.pos, 'growth');
      }
    }

    if (game.grid[this.pos.y + 1][this.pos.x].type === 'pipe') {
      yPlus = 1;
    } if (game.grid[this.pos.y - 1][this.pos.x].type === 'pipe') {
      yPlus = -1;
    } if (game.grid[this.pos.y][this.pos.x + 1].type === 'pipe') {
      xPlus = 1;
    } if (game.grid[this.pos.y][this.pos.x - 1].type === 'pipe') {
      xPlus = -1;
    }

    if (
      !game.tileData[game.grid[this.pos.y + 1][this.pos.x].type].rootable &&
      !game.tileData[game.grid[this.pos.y - 1][this.pos.x].type].rootable &&
      !game.tileData[game.grid[this.pos.y][this.pos.x + 1].type].rootable &&
      !game.tileData[game.grid[this.pos.y][this.pos.x - 1].type].rootable
    ) {
      this.destroy();
    }

    if (xPlus && !Math.floor(Math.random() * 2)) { // One in two chance
      object = new game.structures.lookup.strangler (this.pos.x + xPlus, this.pos.y);
      game.structures.push(object);
      game.grid[this.pos.y][this.pos.x + xPlus].tenant = object;
      game.grid[this.pos.y][this.pos.x + xPlus].type = 'strangler';
      game.organ.playIfVisible(this.pos, 'crunch');
    }

    if (yPlus && !Math.floor(Math.random() * 2)) { // One in two chance
      object = new game.structures.lookup.strangler (this.pos.x, this.pos.y + yPlus);
      game.structures.push(object);
      game.grid[this.pos.y + yPlus][this.pos.x].tenant = object;
      game.grid[this.pos.y + yPlus][this.pos.x].type = 'strangler';
      game.organ.playIfVisible(this.pos, 'crunch');
    }

  }
};
