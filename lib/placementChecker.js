builder.checkPlacement = function (object, place) {
  // Checks whether the tile a player is trying to put the new building
  // on is a valid location for that building.
  var x; var y;
  x = place.x;
  y = place.y;
  if (game.energy < this.builds[object].cost) {
    return false;
  }
  switch (object) {
    case 'pipe':
    // PLACE PIPE
      if (game.grid[y][x].type !== 'empty') { return false; }
      if (
        game.tileData[game.grid[y + 1][x].type].pipeable ||
        game.tileData[game.grid[y - 1][x].type].pipeable ||
        game.tileData[game.grid[y][x + 1].type].pipeable ||
        game.tileData[game.grid[y][x - 1].type].pipeable
      ) {
        return true;
      } else {
        return false;
      }
      break;
    case 'destroyer':
    case 'contaminator':
    // PLACE DESTROYER OR CONTAMINATOR
      if (game.grid[y][x].type !== 'empty') { return false; }
      if ((
        game.tileData[game.grid[y + 1][x].type].pipeable ||
        game.tileData[game.grid[y - 1][x].type].pipeable ||
        game.tileData[game.grid[y][x + 1].type].pipeable ||
        game.tileData[game.grid[y][x - 1].type].pipeable
      ) && (
        ['empty', 'pipe', 'sea', 'boulder', 'deposit', 'root', 'rootflower', 'strangler', 'shipwreck'].includes(game.grid[y + 1][x].type) &&
        ['empty', 'pipe', 'sea', 'boulder', 'deposit', 'root', 'rootflower', 'strangler', 'shipwreck'].includes(game.grid[y - 1][x].type) &&
        ['empty', 'pipe', 'sea', 'boulder', 'deposit', 'root', 'rootflower', 'strangler', 'shipwreck'].includes(game.grid[y][x + 1].type) &&
        ['empty', 'pipe', 'sea', 'boulder', 'deposit', 'root', 'rootflower', 'strangler', 'shipwreck'].includes(game.grid[y][x - 1].type)
      )) {
        return true;
      } else {
        return false;
      }
      break;
    case 'researchStation':
    case 'chemicalPlant':
    // PLACE RESEARCH STATION OR CHEMICAL PLANT
      if (game.grid[y][x].type !== 'empty') { return false; }
      if ((
        game.tileData[game.grid[y + 1][x].type].pipeable ||
        game.tileData[game.grid[y - 1][x].type].pipeable ||
        game.tileData[game.grid[y][x + 1].type].pipeable ||
        game.tileData[game.grid[y][x - 1].type].pipeable
      ) && (
        ['empty', 'pipe', 'sea', 'boulder', 'deposit', 'root', 'strangler', 'shipwreck'].includes(game.grid[y + 1][x].type) &&
        ['empty', 'pipe', 'sea', 'boulder', 'deposit', 'root', 'strangler', 'shipwreck'].includes(game.grid[y - 1][x].type) &&
        ['empty', 'pipe', 'sea', 'boulder', 'deposit', 'root', 'strangler', 'shipwreck'].includes(game.grid[y][x + 1].type) &&
        ['empty', 'pipe', 'sea', 'boulder', 'deposit', 'root', 'strangler', 'shipwreck'].includes(game.grid[y][x - 1].type)
      )) {
        return true;
      } else {
        return false;
      }
      break;
    case 'extractor':
    // PLACE EXTRACTOR
      if (game.grid[y][x].type !== 'empty') { return false; }
      if (
        (
          game.tileData[game.grid[y + 1][x].type].pipeable ||
          game.tileData[game.grid[y - 1][x].type].pipeable ||
          game.tileData[game.grid[y][x + 1].type].pipeable ||
          game.tileData[game.grid[y][x - 1].type].pipeable
        ) && (
          ['deposit', 'shipwreck'].includes(game.grid[y + 1][x].type) ||
          ['deposit', 'shipwreck'].includes(game.grid[y - 1][x].type) ||
          ['deposit', 'shipwreck'].includes(game.grid[y][x + 1].type) ||
          ['deposit', 'shipwreck'].includes(game.grid[y][x - 1].type)
        ) && (
          ['empty', 'pipe', 'deposit', 'boulder', 'sea', 'rootflower', 'root', 'strangler', 'shipwreck'].includes(game.grid[y + 1][x].type) &&
          ['empty', 'pipe', 'deposit', 'boulder', 'sea', 'rootflower', 'root', 'strangler', 'shipwreck'].includes(game.grid[y - 1][x].type) &&
          ['empty', 'pipe', 'deposit', 'boulder', 'sea', 'rootflower', 'root', 'strangler', 'shipwreck'].includes(game.grid[y][x + 1].type) &&
          ['empty', 'pipe', 'deposit', 'boulder', 'sea', 'rootflower', 'root', 'strangler', 'shipwreck'].includes(game.grid[y][x - 1].type)
        )
      ) {
        return true;
      } else {
        return false;
      }
      break;
  }
};
