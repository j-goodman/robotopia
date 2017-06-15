/*
BUILDER.JS
An object with methods to handle constructing new structures.
*/

var builder = {};

builder.builds = {
  pipe: {
    cost: 1,
    image: 'tiles/pipes/off-abcd.png',
    name: "Pipe",
    sound: 'hammerfall',
    tag: 'pipe',
  },
  salvageCamp: {
    cost: 10,
    image: 'tiles/salvageCamp.png',
    name: "Salvage Camp",
    sound: 'wheelstop',
    tag: 'salvageCamp',
  }
};

builder.build = function (object, menu) {
  // Initiate the building process -- makes the player's cursor
  // A 'build' cursor, so they can place the requested structure.
  var image;

  if (!game.builtBefore) {
    game.builtBefore = true;
    document.getElementsByClassName('textbox')[0].innerText = "Use the escape key to cancel building.";
    setTimeout(function () {
      document.getElementsByClassName('textbox')[0].innerText = "";
    }, 7000);
  }

  image = new Image ();
  image.src = object.image;
  game.cursor.mode = 'builder';
  game.cursor.building = object.tag;
  game.cursor.image = image;
};

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
      if (game.grid[y][x].type !== 'empty') { return false; }
      if (
        game.tileData[game.grid[y + 1][x].type].pipable ||
        game.tileData[game.grid[y - 1][x].type].pipable ||
        game.tileData[game.grid[y][x + 1].type].pipable ||
        game.tileData[game.grid[y][x - 1].type].pipable
      ) {
        return true;
      } else {
        return false;
      }
      break;
    case 'salvageCamp':
      if (game.grid[y][x].type !== 'empty') { return false; }
      if (
        (
          game.grid[y + 1][x].type === 'pipe' ||
          game.grid[y - 1][x].type === 'pipe' ||
          game.grid[y][x + 1].type === 'pipe' ||
          game.grid[y][x - 1].type === 'pipe'
        ) && (
          game.grid[y + 1][x].type === 'deposit' ||
          game.grid[y - 1][x].type === 'deposit' ||
          game.grid[y][x + 1].type === 'deposit' ||
          game.grid[y][x - 1].type === 'deposit'
        ) && (
          ['empty', 'pipe', 'deposit'].includes(game.grid[y + 1][x].type) &&
          ['empty', 'pipe', 'deposit'].includes(game.grid[y - 1][x].type) &&
          ['empty', 'pipe', 'deposit'].includes(game.grid[y][x + 1].type) &&
          ['empty', 'pipe', 'deposit'].includes(game.grid[y][x - 1].type)
        )
      ) {
        return true;
      } else {
        return false;
      }
      break;
  }
};

builder.placeBuilding = function (object, place) {
  // If placement check is true, add the new structure to the grid,
  // otherwise reject it.
  if (this.checkPlacement(object, place)) {
    game.grid[place.y][place.x].type = object;
    game.structures.push(new game.structures.lookup[object] (place.x, place.y));
    game.energy -= this.builds[object].cost;
    game.organ.play(this.builds[object].sound);
    game.cursor.mode = 'selector';
  } else {
    this.rejectPlacement();
  }
};

builder.rejectPlacement = function () {
  // Play the rejected build sound effect.
  game.organ.play('twang');
};
