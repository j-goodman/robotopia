/*
PLAY.JS
Initialize gameplay and call other necessary functions.
*/

var game = {};

game.settings = {
  grid: {
    height: 32,
    width: 32,
  },
  viewport: {
    height: 8,
    origin: { // Initial values for viewport origin.
      x: 4,
      y: 4,
    },
    width: 16,
  },
  tileSize: 20, // Number of pixels in a tile sprite.
  depositRarity: 26, // One out of x empty squares will be energy deposits.
  boulderRarity: 3,
  tutorialsOn: true,
};

game.tileData = tileData;
game.builder = builder;
game.organ = organ;
game.structures = structures;

game.menuSubject = null;
game.builtBefore = false;
game.energy = 0;

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

  if (game.settings.tutorialsOn) {
    setTimeout(function () {
      document.getElementsByClassName('textbox')[0].style.display = 'block';
      document.getElementsByClassName('textbox')[0].innerText = "Use your arrow keys to explore the map.";
      setTimeout(function () {
        document.getElementsByClassName('textbox')[0].innerText = "";
        document.getElementsByClassName('textbox')[0].style.display = 'none';
      }, 6000);
    }, 14000);
  }

  document.onmousemove = function (event) {
    game.mouseEvent = event;
  };
  setInterval(function () {
    if (game.mouseEvent) {
      game.grid.draw();
      game.structures.act();
      game.cursor.update(game.mouseEvent);
    }
  }, 32);
};

loadTiles();
