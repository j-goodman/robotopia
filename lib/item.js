var Item = function (tag) {
  this.tag = tag;
};

Item.prototype.use = function () {
  menus.hideMenu();
  game.cursor.mode = 'item';
  game.cursor.item = game.itemData[this.tag];
};

var dropPlasmabomb = function (x, y) {
  destroySquare(x, y);
  destroySquare(x + 1, y);
  destroySquare(x - 1, y);
  destroySquare(x, y + 1);
  destroySquare(x, y - 1);
  window.setTimeout(function () {
    destroySquare(x + 1, y + 1);
    destroySquare(x + 1, y - 1);
    destroySquare(x - 1, y + 1);
    destroySquare(x - 1, y - 1);
  }, 120);
  window.setTimeout(function () {
    destroySquare(x - 2, y - 1);
    destroySquare(x - 2, y);
    destroySquare(x - 2, y + 1);
    destroySquare(x - 1, y - 2);
    destroySquare(x, y - 2);
    destroySquare(x + 1, y - 2);
    destroySquare(x + 2, y - 1);
    destroySquare(x + 2, y);
    destroySquare(x + 2, y + 1);
    destroySquare(x - 1, y + 2);
    destroySquare(x, y + 2);
    destroySquare(x + 1, y + 2);
  }, 240);
  window.setTimeout(function () {
    destroySquare(x - 3, y - 1);
    destroySquare(x - 3, y);
    destroySquare(x - 3, y + 1);
    destroySquare(x - 1, y - 3);
    destroySquare(x, y - 3);
    destroySquare(x + 1, y - 3);
    destroySquare(x + 3, y - 1);
    destroySquare(x + 3, y);
    destroySquare(x + 3, y + 1);
    destroySquare(x - 1, y + 3);
    destroySquare(x, y + 3);
    destroySquare(x + 1, y + 3);
    destroySquare(x + 2, y + 2);
    destroySquare(x + 2, y - 2);
    destroySquare(x - 2, y + 2);
    destroySquare(x - 2, y - 2);
  }, 360);
  window.setTimeout(function () {
    destroySquare(x - 4, y - 1);
    destroySquare(x - 4, y);
    destroySquare(x - 4, y + 1);
    destroySquare(x - 1, y - 4);
    destroySquare(x, y - 4);
    destroySquare(x + 1, y - 4);
    destroySquare(x + 4, y - 1);
    destroySquare(x + 4, y);
    destroySquare(x + 4, y + 1);
    destroySquare(x - 1, y + 4);
    destroySquare(x, y + 4);
    destroySquare(x + 1, y + 4);
    destroySquare(x + 3, y + 3);
    destroySquare(x + 3, y - 3);
    destroySquare(x - 3, y + 3);
    destroySquare(x - 3, y - 3);
    destroySquare(x + 2, y + 3);
    destroySquare(x + 2, y - 3);
    destroySquare(x - 2, y + 3);
    destroySquare(x - 2, y - 3);
    destroySquare(x + 3, y + 2);
    destroySquare(x + 3, y - 2);
    destroySquare(x - 3, y + 2);
    destroySquare(x - 3, y - 2);
  }, 480);
};

var destroySquare = function (x, y) {
  if (!['powerplant', 'sea', 'shipwreck'].includes(game.grid[y][x].type)) {
    if (game.grid[y][x].poisoned) {
      game.grid[y][x].poisoned = !!Math.floor(Math.random() * 4);
    }
    if (
      game.grid[y] &&
      game.grid[y][x] &&
      game.grid[y][x].tenant &&
      game.grid[y][x].tenant.destroy
    ) {
      game.grid[y][x].tenant.destroy();
    }
    plasma = new game.structures.lookup.plasma (x, y);
    game.structures.push(plasma);
    game.grid[y][x].type = 'plasma';
  } else {
    return false;
  }
};

var itemData = {
  triggerpin: {
    applications: ['destroyer'],
    description: "A weapon component from the great Human Wars. Apply it to a Destroyer to make it fire automatically. You'll be able to remove it at any time.",
    image: new Image (),
    name: "Automated Triggerpin",
    tag: 'triggerpin',
  },
  plasmabomb: {
    applications: ['all'],
    description: "Plasma bombs were the humans' primary weapons against the glorious machine uprising. They'll destroy everything in a radius of four squares when dropped.",
    image: new Image (),
    method: dropPlasmabomb,
    name: "Plasma Bomb",
    tag: 'plasmabomb',
  },
  geoharvester: {
    applications: ['extractor'],
    description: "An advanced energy source that mines power from rock. Attach it to an Extractor to let it consume boulders.",
    image: new Image (),
    name: "Geoharvester",
    tag: 'geoharvester',
  },
};

itemData.triggerpin.image.src = 'items/triggerpin.png';
itemData.plasmabomb.image.src = 'items/plasmabomb.png';
itemData.geoharvester.image.src = 'items/geoharvester.png';
