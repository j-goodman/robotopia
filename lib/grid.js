function setupGrid (game) {
  var i; var j;
  var row;
  game.grid = [];
  for (i=0 ; i<game.settings.grid.height ; i++) {
    row = [];
    for (j=0 ; j<game.settings.grid.width ; j++) {
      row.push(new Square ({type: 'empty'}));
    }
    game.grid.push(row);
  }
  game.grid[6][8].type = 'powerplant';
  game.grid.draw = drawGrid;
  game.viewport = game.settings.viewport;
}

function drawGrid () {
  var i; var j;
  var viewport = game.viewport;
  for (i=viewport.origin.y ; i<viewport.origin.y + viewport.height ; i++) {
    for (j=viewport.origin.x ; j<viewport.origin.x + viewport.width ; j++) {
      game.ctx.drawImage(game.tiles[game.grid[i][j].type], (j - viewport.origin.x) * 20, (i - viewport.origin.y) * 20);
    }
  }
}
