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

  for (i=0 ; i<this.structures.length ; i++) {
    if (this.structures[i].tenant) {
      game.structures.push(this.structures[i].tenant);
    }
  }

  return grid;
};

mapbuilder.addRootflower = function () {
    let flowerspawn = {
        x: 1000000,
        y: 1000000
    }
    while (
        distanceBetween(game.settings.spawn, flowerspawn) >= 20 ||
        distanceBetween(game.settings.spawn, flowerspawn) <= 18
    ) {
        flowerspawn = {
            x: Math.ceil(Math.random() * (game.settings.grid.width - 2)),
            y: Math.ceil(Math.random() * (game.settings.grid.height - 2))
        }
    }
    game.settings.flowerspawn = flowerspawn
    let x = flowerspawn.x;
    let y = flowerspawn.y;
    object = new game.structures.lookup.rootflower (x, y);
    square = new Square ({type: 'rootflower'}, x, y);
    this.clearPath({x: game.settings.spawn.y, y: game.settings.spawn.x}, {x: x, y: y}, ['powerplant', 'rootflower'])
    square.tenant = object;
    game.structures.push(object);
    game.grid[y][x] = square;
    game.grid.push(row);
    mapbuilder.clearCircle({x: x, y: y}, 5, ['rootflower', 'deposit', 'powerplant', 'shipwreck'], 0.35)
};

mapbuilder.clearPath = function (from, to, exceptions = []) {
    let bulldozer = {x: from.y, y: from.x}
    exceptions.push('sea')
    while (bulldozer.x !== to.x || bulldozer.y !== to.y) {
        if (!exceptions.includes(game.grid[bulldozer.y][bulldozer.x].type)) {
            game.grid[bulldozer.y][bulldozer.x].type = 'empty';
            game.grid[bulldozer.y][bulldozer.x].tenant = null;
        }
        if (Math.round(Math.random())) {
            bulldozer.x += bulldozer.x < to.x ? 1 : -1
        } else {
            bulldozer.y += bulldozer.y < to.y ? 1 : -1
        }
    }
}

mapbuilder.addFeatures = function () {
    let x = Math.floor((game.settings.spawn.x + game.settings.flowerspawn.x) / 2)
    let y = Math.floor((game.settings.spawn.y + game.settings.flowerspawn.y) / 2)
    mapbuilder.clearCircle({x: x, y: y}, 6, ['rootflower', 'deposit', 'powerplant', 'shipwreck'], 0.6)
}

mapbuilder.clearCircle = function (center, radius, exceptions = [], completeness = 1) {
    let bulldozer = {x: center.x - radius - 1, y: center.y - radius - 1}
    exceptions.push('sea')
    for (let bulldozery = center.y - radius; bulldozery <= center.y + radius + 1; bulldozery++) {
        for (let bulldozerx = center.x - radius; bulldozerx <= center.x + radius + 1; bulldozerx++) {
            if (
              game.grid[bulldozery] && game.grid[bulldozery][bulldozerx] &&
              !exceptions.includes(game.grid[bulldozery][bulldozerx].type) &&
              (distanceBetween(center, {x: bulldozerx, y: bulldozery}) < radius + 0.5)
              && (Math.random() < completeness)
            ) {
                  game.grid[bulldozery][bulldozerx].type = 'empty';
                  game.grid[bulldozery][bulldozerx].tenant = null;
            }
        }
    }
}

mapbuilder.addPlayer = function () {
  let spawn = {
      x: Math.floor(game.settings.grid.width / 2) + Math.floor(Math.random() * Math.floor(game.settings.grid.width / 2) + 1) - Math.floor(game.settings.grid.width / 4),
      y: Math.floor(game.settings.grid.height / 2) + Math.floor(Math.random() * Math.floor(game.settings.grid.width / 2) + 1) - Math.floor(game.settings.grid.width / 4),
  }
  game.settings.spawn.x = spawn.x
  game.settings.spawn.y = spawn.y
  game.grid[spawn.y][spawn.x].type = 'powerplant';
  game.mainPowerplant = new Powerplant (spawn.y, spawn.x);
  game.structures.push(game.mainPowerplant);

  game.settings.viewport.origin.x = spawn.x - Math.floor(game.settings.viewport.width / 2) + 2
  game.settings.viewport.origin.y = spawn.y - Math.floor(game.settings.viewport.height / 2) + 1

  if (game.settings.viewport.origin.x + game.settings.viewport.width >= game.settings.grid.width) {
      game.settings.viewport.origin.x = game.settings.grid.width - game.settings.viewport.width - 1
  }

  if (game.settings.viewport.origin.y + game.settings.viewport.height >= game.settings.grid.height) {
      game.settings.viewport.origin.y = game.settings.grid.height - game.settings.viewport.height - 1
  }

  mapbuilder.clearCircle({x: spawn.x, y: spawn.y}, 2, ['powerplant'])

  let safetyDeposit = new Deposit (spawn.x - 3, spawn.y);
  game.grid[spawn.y - 3][spawn.x].type = 'deposit';
  game.grid[spawn.y - 3][spawn.x].tenant = safetyDeposit;
  game.structures.push(safetyDeposit);
};
