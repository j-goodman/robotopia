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
  },
  destroyer: {
    cost: 6,
    image: 'tiles/destroyers/destroyer-1.png',
    name: "Destroyer",
    sound: 'initialize',
    tag: 'destroyer',
  },
};

builder.build = function (object, menu) {
  // Initiate the building process -- makes the player's cursor
  // A 'build' cursor, so they can place the requested structure.
  var image;

  if (!game.builtBefore) {
    game.builtBefore = true;
    document.getElementsByClassName('textbox')[0].style.display = 'block';
    document.getElementsByClassName('textbox')[0].innerText = "Use the escape key to cancel building.";
    setTimeout(function () {
      document.getElementsByClassName('textbox')[0].innerText = "";
      document.getElementsByClassName('textbox')[0].style.display = 'none';
    }, 7000);
  }

  image = new Image ();
  image.src = object.image;
  game.cursor.mode = 'builder';
  game.cursor.building = object.tag;
  game.cursor.image = image;
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
