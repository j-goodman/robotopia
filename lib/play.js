/*
PLAY.JS
Initialize gameplay and call other necessary functions.
*/

var game = {};

game.settings = {
  spawn: {
    x: 8,
    y: 6,
  },
  grid: {
    height: 32,
    width: 32,
  },
  viewport: {
    height: 8,
    origin: { // Initial values for viewport origin.
      x: 1,
      y: 7,
    },
    width: 16,
  },
  tileSize: 20, // Number of pixels in a tile sprite.
  depositRarity: 16, // One out of x non-empty squares will be energy deposits.
  boulderRarity: 3,
  tutorialsOn: true,
};

game.tileData = tileData;
game.itemData = itemData;
game.builder = builder;
game.organ = organ;
game.structures = structures;
game.navigator = navigator;
game.mapbuilder = mapbuilder;

game.menuSubject = null;
game.builtBefore = false;
game.gotItemBefore = false;
game.time = 0;
game.energy = 16;

onload = function () {
  // Setup the game canvas, initialize the menus system, the player
  // cursor, and the sound organ, and establish the interval function.
  game.canvas = document.getElementById('canvas');
  game.ctx = game.canvas.getContext('2d');
  setupGrid(game);
  game.grid.draw();
  game.cursor = new Cursor (game);
  menus.initialize();
  game.cursor.initialize();
  game.organ.initialize();
  setTimeout(function () {
    document.getElementsByClassName('textbox')[0].innerText = "";
    document.getElementsByClassName('textbox')[0].style.display = 'none';
  }, game.settings.tutorialsOn ? 7000 : 1000);

  document.onmousemove = function (event) {
    game.mouseEvent = event;
  };
  setInterval(function () {
    if (game.mouseEvent) {
      game.time += 1;
      game.grid.draw();
      game.structures.act();
      game.cursor.update(game.mouseEvent);
    }
  }, 32);
};

loadTiles();
