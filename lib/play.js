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

game.structures = structures;

onload = function () {
  game.canvas = document.getElementById('canvas');
  game.ctx = game.canvas.getContext('2d');
  setupGrid(game);
  game.grid.draw();
  game.cursor = new Cursor (game);
  windows.initialize();
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
