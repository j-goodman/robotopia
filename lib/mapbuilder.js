var mapbuilder = {};

mapbuilder.structures = [];

mapbuilder.buildGrid = function () {
  var grid;
  var shipwreckCount;
  var object;
  var square;
  var spawn;
  var x;
  var y;
  spawn = game.settings.spawn;
  grid = [];
  for (i=0 ; i<game.settings.grid.height ; i++) {
    row = [];
    for (j=0 ; j<game.settings.grid.width ; j++) {
      if (i === 0 || i === game.settings.grid.height - 1 ||
        j === 0 || j === game.settings.grid.width - 1) {
          row.push(new Square ({type: 'sea'}, j, i));
        } else {
          if (Math.floor(Math.random() * game.settings.depositRarity)) {
            square = new Square ({type: 'boulder'}, j, i);
            object = new game.structures.lookup.boulder (j, i);
          } else {
            square = new Square ({type: 'deposit'}, j, i);
            object = new game.structures.lookup.deposit (j, i);
          }
          mapbuilder.structures.push(square);
          square.tenant = object;
          row.push(square);
        }
    }
    grid.push(row);
  }

  this.blastArea(grid, spawn.x, spawn.y, 11, {preserveDeposits: true});
  this.blastArea(grid, spawn.x + 10, spawn.y, 10, {preserveDeposits: true});
  this.blastArea(grid, spawn.x - 4, spawn.y + 6, 8, {preserveDeposits: true});
  this.blastArea(grid, spawn.x + 1, spawn.y, 13, {preserveDeposits: true});
  this.blastArea(grid, spawn.x + 16, spawn.y + 6, 9, {preserveDeposits: true});
  this.blastArea(grid, spawn.x + 8, spawn.y - 1, 12, {preserveDeposits: true});
  this.blastArea(grid, spawn.x + 12, spawn.y + 14, 9, {preserveDeposits: true});
  this.blastArea(grid, spawn.x - 4, spawn.y + 14, 6, {preserveDeposits: true});
  this.blastArea(grid, spawn.x - 1, spawn.y + 21, 6, {preserveDeposits: true});
  this.blastArea(grid, 27, 27, 10, {preserveDeposits: true});

  this.blastArea(grid, 12, 20, 14, {preserveDeposits: true});
  this.blastArea(grid, 27, 6, 12, {preserveDeposits: true});
  this.blastArea(grid, 6, 12, 12, {preserveDeposits: true});
  this.blastArea(grid, 20, 27, 12, {preserveDeposits: true});
  this.blastArea(grid, 17, 14, 6, {preserveDeposits: true});
  this.blastArea(grid, 15, 13, 8, {preserveDeposits: true});
  this.blastArea(grid, 15, 11, 7, {preserveDeposits: true});

  this.blastArea(grid, spawn.x, spawn.y, 4, {clearEverything: true});

  for (i=0 ; i<this.structures.length ; i++) {
    if (this.structures[i].tenant) {
      game.structures.push(this.structures[i].tenant);
    }
  }

  shipwreckCount = 13;

  x = 1;
  y = 12;
  y += Math.round(Math.random() * 4);
  grid[y][x].type = 'shipwreck';
  grid[y][x].tenant = new game.structures.lookup.shipwreck (x, y);
  game.structures.push(grid[y][x].tenant);
  grid[y][x].tenant.contents = [new Item ('triggerpin')];
  shipwreckCount -= 1;

  while (shipwreckCount > 0) {
    x = Math.floor(Math.random() * game.settings.grid.width);
    y = Math.floor(Math.random() * game.settings.grid.height);
    if (
      (x > game.settings.spawn.x + 8 || x < game.settings.spawn.x - 8) &&
      (y > game.settings.spawn.y + 8 || y < game.settings.spawn.y - 8)
    ) {
      if (grid[y][x].type === 'boulder') {
        shipwreckCount -= 1;
        grid[y][x].type = 'shipwreck';
        grid[y][x].tenant = new game.structures.lookup.shipwreck (x, y);
        game.structures.push(grid[y][x].tenant);
      }
    }
  }

  return grid;
};

// mapbuilder.buildTestRoom = function () {
//   var grid;
//   var object;
//   var square;
//   var spawn;
//   var x; var y;
//   game.settings.grid.height = 20;
//   game.settings.grid.width = 20;
//   spawn = game.settings.spawn;
//   grid = [];
//   this.structures = [];
//
//   for (i=0 ; i<game.settings.grid.height ; i++) {
//     row = [];
//     for (j=0 ; j<game.settings.grid.width ; j++) {
//       if (i === 0 || i === game.settings.grid.height - 1 ||
//       j === 0 || j === game.settings.grid.width - 1) {
//         row.push(new Square ({type: 'sea'}, j, i));
//       } else {
//         row.push(new Square ({type: 'empty'}, j, i));
//       }
//     }
//     grid.push(row);
//   }
//
//   for (i=0 ; i<this.structures.length ; i++) {
//     if (this.structures[i].tenant) {
//       game.structures.push(this.structures[i].tenant);
//     }
//   }
//
//   game.grid = grid;
//   this.addInstances();
//   return grid;
// };

mapbuilder.addInstances = function () {
    if (Math.round(Math.random())) {
      x = 18; y = 8;
    } else {
      x = 22; y = 20;
    }

    this.blastArea(game.grid, x, y, 4, {clearEverything: true});

    object = new game.structures.lookup.rootflower (x, y);
    square = new Square ({type: 'rootflower'}, x, y);
    this.clearPath({x: game.settings.spawn.x, y: game.settings.spawn.y}, {x: x, y: y})
    square.tenant = object;
    game.structures.push(object);
    game.grid[y][x] = square;
    game.grid.push(row);
};

mapbuilder.blastArea = function (grid, x, y, size, data) {
  var i; var j;
  var half;
  var odds;
  half = Math.floor(size / 2);
  x = x - half;
  y = y - half;
  for (i=0 ; i<size ; i++) {
    for (j=0 ; j<size ; j++) {
      if (grid[y + i] && grid[y + i][x + j]) {
        odds = (half - (Math.abs(i - half) + Math.abs(j - half)) / 2) * 2;
        if (grid[y + i][x + j].type !== 'sea' && (Math.floor(Math.random() * odds) || data.clearEverything)) {
          if (!(data.preserveDeposits &&
            (grid[y + i][x + j].type === 'deposit' ||
            (grid[y + i + 1][x + j].type === 'deposit' && Math.floor(Math.random() * 4)) ||
            (grid[y + i][x + j + 1].type === 'deposit' && Math.floor(Math.random() * 4)) ||
            (grid[y + i - 1][x + j].type === 'deposit' && Math.floor(Math.random() * 4)) ||
            (grid[y + i][x + j - 1].type === 'deposit' && Math.floor(Math.random() * 4)) ||
            (grid[y + i - 1][x + j - 1].type === 'deposit' && Math.floor(Math.random() * 4)) ||
            (grid[y + i + 1][x + j - 1].type === 'deposit' && Math.floor(Math.random() * 4)) ||
            (grid[y + i + 1][x + j + 1].type === 'deposit' && Math.floor(Math.random() * 4)) ||
            (grid[y + i + 1][x + j + 1].type === 'deposit' && Math.floor(Math.random() * 4)) ||
            false)
          )) {
            grid[y + i][x + j].type = 'empty';
            grid[y + i][x + j].tenant = null;
          }
        }
      }
    }
  }
};

mapbuilder.clearPath = function (from, to) {
    let bulldozer = {x: from.y, y: from.x}
    while (bulldozer.x !== to.x || bulldozer.y !== to.y) {
        game.grid[bulldozer.y][bulldozer.x].type = 'empty';
        game.grid[bulldozer.y][bulldozer.x].tenant = null;
        if (Math.round(Math.random())) {
            bulldozer.x += bulldozer.x < to.x ? 1 : -1
        } else {
            bulldozer.y += bulldozer.y < to.y ? 1 : -1
        }
    }
}

mapbuilder.addPlayer = function () {
  game.grid[game.settings.spawn.x][game.settings.spawn.y].type = 'powerplant';
  game.mainPowerplant = new Powerplant (game.settings.spawn.y, game.settings.spawn.x);
  game.structures.push(game.mainPowerplant);
};
