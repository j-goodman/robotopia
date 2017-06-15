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
          } else if (!Math.floor(Math.random() * game.settings.boulderRarity)) {
            square = new Square ({type: 'boulder'});
            for (k=0 ; k<12 ; k++) {
              random = {
                x: Math.round(Math.random() * 2),
                y: Math.round(Math.random() * 2),
              };
              if (game.grid[i - k * random.x] &&
                game.grid[i - k * random.x][j - k * random.y] &&
                game.grid[i - k * random.x]
                [j - k * random.y].type === 'empty'
              ) {
                game.grid[i - k * random.x][j - k * random.y].type = 'boulder';
                object = new game.structures.lookup.boulder (j, i);
                game.structures.push(object);
                square.tenant = object;
              }
            }
            object = new game.structures.lookup.boulder (j, i);
            game.structures.push(object);
            square.tenant = object;
            row.push(square);
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
  game.grid[6 + i][9].type = 'empty';
  game.grid[6 + i][9].tenant = null;
  game.grid[6 + i][10].type = 'empty';
  game.grid[6 + i][10].tenant = null;
  game.grid[7 + i][9].type = 'empty';
  game.grid[5 + i][9].tenant = null;
  game.grid[7 + i][10].type = 'empty';
  game.grid[5 + i][10].tenant = null;
  game.grid[6 + i][11].type = 'empty';
  game.grid[6 + i][11].tenant = null;
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
      } else if (game.grid[i][j].type === 'destroyer') {
        drawDestroyer(i, j, viewport);
      } else {
        if (game.grid[i][j].type !== 'empty') {
          game.ctx.drawImage(game.tiles[game.grid[i][j].type], (j - viewport.origin.x) * 20, (i - viewport.origin.y) * 20);
        }
      }
    }
  }
}

var destroyerSprites = [];
var sprite;
sprite = new Image (); sprite.src = 'tiles/destroyers/destroyer-0.png'; destroyerSprites[0] = sprite;
sprite = new Image (); sprite.src = 'tiles/destroyers/destroyer-1.png'; destroyerSprites[1] = sprite;
sprite = new Image (); sprite.src = 'tiles/destroyers/destroyer-2.png'; destroyerSprites[2] = sprite;
sprite = new Image (); sprite.src = 'tiles/destroyers/destroyer-3.png'; destroyerSprites[3] = sprite;


function drawDestroyer (i, j, viewport) {
  var image;
  image = destroyerSprites[game.grid[i][j].tenant.angle];
  game.ctx.drawImage(image, (j - viewport.origin.x) * 20, (i - viewport.origin.y) * 20);
}
