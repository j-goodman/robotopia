var mapbuilder = {};

mapbuilder.structures = [];

mapbuilder.buildGrid = function () {
  var grid;
  var object;
  var square;
  var spawn;
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

  this.blastArea(grid, spawn.x, spawn.y, 9, {preserveDeposits: true});
  this.blastArea(grid, spawn.x + 10, spawn.y, 9, {preserveDeposits: true});
  this.blastArea(grid, spawn.x - 4, spawn.y + 6, 7, {preserveDeposits: true});
  this.blastArea(grid, spawn.x + 16, spawn.y + 6, 8, {preserveDeposits: true});
  this.blastArea(grid, spawn.x + 12, spawn.y + 14, 8, {preserveDeposits: true});
  this.blastArea(grid, spawn.x - 4, spawn.y + 14, 5, {preserveDeposits: true});
  this.blastArea(grid, spawn.x - 1, spawn.y + 21, 6, {preserveDeposits: true});
  this.blastArea(grid, 27, 27, 9, {preserveDeposits: true});
  this.blastArea(grid, spawn.x, spawn.y, 3, {clearEverything: true});

  for (i=0 ; i<this.structures.length ; i++) {
    if (this.structures[i].tenant) {
      game.structures.push(this.structures[i].tenant);
    }
  }

  return grid;
};

mapbuilder.buildTestRoom = function () {
  var grid;
  var object;
  var square;
  var spawn;
  var x; var y;
  game.settings.grid.height = 20;
  game.settings.grid.width = 20;
  spawn = game.settings.spawn;
  grid = [];
  this.structures = [];

  for (i=0 ; i<game.settings.grid.height ; i++) {
    row = [];
    for (j=0 ; j<game.settings.grid.width ; j++) {
      if (i === 0 || i === game.settings.grid.height - 1 ||
      j === 0 || j === game.settings.grid.width - 1) {
        row.push(new Square ({type: 'sea'}, j, i));
      } else {
        row.push(new Square ({type: 'empty'}, j, i));
      }
    }
    grid.push(row);
  }

  x = 5; y = 5;
  object = new game.structures.lookup.boulder (x, y);
  square = new Square ({type: 'boulder'}, x, y);
  square.tenant = object;
  this.structures.push(object);
  grid[x][y] = square;
  grid.push(row);

  for (i=0 ; i<this.structures.length ; i++) {
    if (this.structures[i].tenant) {
      game.structures.push(this.structures[i].tenant);
    }
  }

  return grid;
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
          if (!(data.preserveDeposits && grid[y + i][x + j].type === 'deposit')) {
            grid[y + i][x + j].type = 'empty';
            grid[y + i][x + j].tenant = null;
          }
        }
      }
    }
  }
};

mapbuilder.addPlayer = function () {
  game.grid[game.settings.spawn.x][game.settings.spawn.y].type = 'powerplant';
  game.mainPowerplant = new Powerplant (game.settings.spawn.y, game.settings.spawn.x);
  game.structures.push(game.mainPowerplant);
};