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
    origin: {
      x: 4,
      y: 4,
    },
    width: 16,
  },
  tileSize: 20,
};

game.tileData = tileData;
game.builder = builder;
game.organ = organ;

onload = function () {
  // Setup the game canvas, initialize the windows system, the player
  // cursor, and the sound organ, and establish the interval function.
  game.canvas = document.getElementById('canvas');
  game.ctx = game.canvas.getContext('2d');
  setupGrid(game);
  game.grid.draw();
  game.cursor = new Cursor (game);
  windows.initialize();
  game.cursor.initialize();
  game.organ.initialize();
  setTimeout(function () {
    document.getElementsByClassName('textbox')[0].innerText = '';
  }, 6000);
  document.onmousemove = function (event) {
    game.mouseEvent = event;
  };
  setInterval(function () {
    if (game.mouseEvent) {
      game.grid.draw();
      game.cursor.update(game.mouseEvent);
    }
  }, 32);
};

loadTiles();
