var builder = {};

builder.builds = {
  pipe: {
    name: "Pipe",
    tag: 'pipe',
    image: 'tiles/pipes/off-abcd.png',
  }
};

builder.build = function (object, menu) {
  var image;
  image = new Image ();
  image.src = object.image;
  game.cursor.mode = 'builder';
  game.cursor.building = object.tag;
  game.cursor.image = image;
};

builder.checkPlacement = function (object, place) {
  var x; var y;
  x = place.x;
  y = place.y;
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
  }
};

builder.placeBuilding = function (object, place) {
  if (this.checkPlacement(object, place)) {
    game.grid[place.y][place.x].type = object;
    game.cursor.mode = 'selector';
  } else {
    this.rejectPlacement();
  }
};

builder.rejectPlacement = function () {
  console.log("Placement rejected.");
};
