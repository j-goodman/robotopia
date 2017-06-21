/*
GRID.JS
The game grid is the matrix on which the game takes place. Each element within
this two-dimensional array is a Square (see square.js).
*/

function setupGrid (game) {
  // Initialize the game grid by putting in the correct number of Squares
  // based on game settings found in play.js.
  var i; var j; var k;
  var object;
  var random;
  var row;
  var square;
  game.grid = game.mapbuilder.buildGrid();
  // game.grid = game.mapbuilder.buildTestRoom();
  game.mapbuilder.addInstances();
  game.grid.draw = drawGrid;
  game.viewport = game.settings.viewport;
  game.mapbuilder.addPlayer();
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
      } else if (game.grid[i][j].type === 'root') {
        drawRoot(i, j, viewport);
      } else if (game.grid[i][j].type === 'destroyer') {
        drawDestroyer(i, j, viewport);
      } else if (game.grid[i][j].type === 'researchStation') {
        drawResearchStation(i, j, viewport);
      } else if (game.grid[i][j].type === 'strangler') {
        drawStrangler(i, j, viewport);
      } else {
        if (game.grid[i][j].type !== 'empty') {
          game.ctx.drawImage(game.tiles[game.grid[i][j].type], (j - viewport.origin.x) * 20, (i - viewport.origin.y) * 20);
        }
      }
    }
  }
}
