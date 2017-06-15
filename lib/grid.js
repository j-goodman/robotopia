/*
GRID.JS
The game grid is the matrix on which the game takes place. Each element within
this two-dimensional array is a Square (see square.js).
*/

function setupGrid (game) {
  // Initialize the game grid by putting in the correct number of Squares
  // based on game settings found in play.js.
  var i; var j;
  var object;
  var row;
  var square;
  game.grid = [];
  for (i=0 ; i<game.settings.grid.height ; i++) {
    row = [];
    for (j=0 ; j<game.settings.grid.width ; j++) {
      if (i === 0 || i === game.settings.grid.height - 1 ||
        j === 0 || j === game.settings.grid.width - 1) {
          row.push(new Square ({type: 'sea'}));
        } else {
          if (Math.floor(Math.random() * game.settings.depositRarity)) {
            row.push(new Square ({type: 'empty'}));
          } else {
            square = new Square ({type: 'deposit'});
            object = new game.structures.lookup.deposit (j, i);
            game.structures.push(object);
            square.tenant = object;
            row.push(square);
          }
        }
    }
    game.grid.push(row);
  }
  i = 0;
  while (game.grid[(6 + i)] && game.grid[6 + i][8].type !== 'empty') {
    i++;
  }
  game.grid[6 + i][8].type = 'powerplant';
  game.structures.push(new Powerplant (8, 6));
  game.grid.draw = drawGrid;
  game.viewport = game.settings.viewport;
}

function drawGrid () {
  // Draw the tiles of the grid based on each square's type.
  var i; var j;
  var viewport = game.viewport;
  for (i=viewport.origin.y ; i<viewport.origin.y + viewport.height ; i++) {
    for (j=viewport.origin.x ; j<viewport.origin.x + viewport.width ; j++) {
      game.ctx.drawImage(game.tiles.empty, (j - viewport.origin.x) * 20, (i - viewport.origin.y) * 20);
      if (game.grid[i][j].type === 'pipe') {
        drawPipe(i, j, viewport);
      } else {
        if (game.grid[i][j].type !== 'empty') {
          game.ctx.drawImage(game.tiles[game.grid[i][j].type], (j - viewport.origin.x) * 20, (i - viewport.origin.y) * 20);
        }
      }
    }
  }
}
