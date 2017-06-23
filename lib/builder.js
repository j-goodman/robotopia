/*
BUILDER.JS
An object with methods to handle constructing new structures.
*/

var builder = {};

builder.builds = {
  destroyer: {
    cost: 30,
    image: 'tiles/destroyers/destroyer-1.png',
    name: "Destroyer",
    sound: 'initialize',
    tag: 'destroyer',
  },
  superDestroyer: {
    cost: 36,
    image: 'tiles/destroyers/superDestroyer-1.png',
    name: "Super Destroyer",
    sound: 'initialize',
    notes: 'superDestroyer',
    tag: 'destroyer',
  },
  precisionDestroyer: {
    cost: 36,
    image: 'tiles/destroyers/precisionDestroyer-1.png',
    name: "Precision Destroyer",
    sound: 'initialize',
    notes: 'precisionDestroyer',
    tag: 'destroyer',
  },
  pipe: {
    cost: 1,
    image: 'tiles/pipes/off-abcd.png',
    name: "Pipe",
    sound: 'hammerfall',
    tag: 'pipe',
  },
  researchStation: {
    cost: 50,
    image: 'tiles/researchStations/researchStation-basic.png',
    name: "Research Station",
    sound: 'machinebuild',
    tag: 'researchStation',
  },
  extractor: {
    cost: 10,
    image: 'tiles/extractor.png',
    name: "Extractor",
    sound: 'wheelstop',
    tag: 'extractor',
  },
};

builder.build = function (object, menu) {
  // Initiate the building process -- makes the player's cursor
  // A 'build' cursor, so they can place the requested structure.
  var image;

  if (object.notes) {
    game.cursor.buildingNotes = object.notes;
  }

  if (!game.builtBefore && game.settings.tutorialsOn) {
    game.builtBefore = true;
    document.getElementsByClassName('textbox')[0].style.display = 'block';
    document.getElementsByClassName('textbox')[0].innerText = "Use the escape key to cancel building.";
    setTimeout(function () {
      document.getElementsByClassName('textbox')[0].innerText = "";
      document.getElementsByClassName('textbox')[0].style.display = 'none';
    }, 7000);
    setTimeout(function () {
      document.getElementsByClassName('textbox')[0].innerText = "Press 'P' at any time to build a pipe.";
      document.getElementsByClassName('textbox')[0].style.display = 'block';
      setTimeout(function () {
        document.getElementsByClassName('textbox')[0].innerText = "";
        document.getElementsByClassName('textbox')[0].style.display = 'none';
      }, 6000);
    }, 54000);
  }

  image = new Image ();
  image.src = object.image;
  game.cursor.mode = 'builder';
  game.cursor.building = object.tag;
  game.cursor.image = image;
};

builder.placeBuilding = function (objectName, place, notes) {
  // If placement check is true, add the new structure to the grid,
  // otherwise reject it.
  var building;
  if (this.checkPlacement(objectName, place)) {
    game.grid[place.y][place.x].type = objectName;
    building = new game.structures.lookup[objectName] (place.x, place.y);
    this.applyNotes(building, notes);
    game.structures.push(building);
    game.energy -= this.builds[objectName].cost;
    game.organ.play(this.builds[objectName].sound);
    game.cursor.mode = 'selector';
    game.cursor.onMove();
  } else {
    this.rejectPlacement();
  }
};

builder.applyNotes = function (building, notes) {
  // Apply special attributes to the newly constructed building.
  switch (notes) {
    case 'superDestroyer':
      building.modifier = 'superDestroyer';
      building.range = 12;
      break;
    case 'precisionDestroyer':
      building.modifier = 'precisionDestroyer';
      building.range = 2;
      break;
  }
  game.cursor.buildingNotes = false;
};

builder.rejectPlacement = function () {
  // Play the rejected build sound effect.
  game.organ.play('twang');
};
