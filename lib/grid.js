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
  game.grid.draw = drawGrid;
  game.viewport = game.settings.viewport;
  game.mapbuilder.addPlayer();
  game.mapbuilder.addRootflower();
  game.mapbuilder.addFeatures();
}

function drawGrid () {
  // Draw the tiles of the grid based on each square's type.
  var i; var j;

  var viewport = game.viewport;

  for (i=viewport.origin.y ; i<viewport.origin.y + viewport.height ; i++) {
    for (j=viewport.origin.x ; j<viewport.origin.x + viewport.width ; j++) {
      let imageName = game.grid[i][j].poisoned ? "poisoned" : "empty"
      game.ctx.drawImage(game.tiles[imageName], (j - viewport.origin.x) * 20 + viewport.pixelOffset.x, (i - viewport.origin.y) * 20 + viewport.pixelOffset.y);
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
      } else if (game.grid[i][j].type === 'rootflower') {
        drawRootflower(i, j, viewport);
      } else if (game.grid[i][j].type === 'chemicalPlant') {
        drawChemicalPlant(i, j, viewport);
      } else if (game.grid[i][j].type === 'extractor' && game.grid[i][j].tenant.modifier === 'superExtractor') {
        drawSuperExtractor(i, j, viewport);
      } else if (game.grid[i][j].type === 'extractor' && game.grid[i][j].tenant.geoharvester) {
        drawGeoharvesterExtractor(i, j, viewport);
      } else {
        if (game.grid[i][j].type !== 'empty') {
          game.ctx.drawImage(game.tiles[game.grid[i][j].type], (j - viewport.origin.x) * 20 + viewport.pixelOffset.x, (i - viewport.origin.y) * 20 + viewport.pixelOffset.y);
        }
      }
    }
  }
  let displayPower = game.energy.toString()
  if (game.energy > 9999) {
      displayPower = '9999+'
  }
  if (displayPower.length < 3) {
    game.ctx.drawImage(game.tiles['powerDisplayShort'], 5, 5)
  } else if (displayPower.length < 5) {
    game.ctx.drawImage(game.tiles['powerDisplay'], 5, 5)
  } else {
    game.ctx.drawImage(game.tiles['powerDisplayLong'], 5, 5)
  }
  game.ctx.font = "12px Courier";
  game.ctx.fillStyle = "#ead600";
  game.ctx.fillText(displayPower, 23, 19);
}

function distanceBetween (from, to) {
    let y = to.x - from.x;
    let x = to.y - from.y;

    return Math.sqrt(x * x + y * y);
}
