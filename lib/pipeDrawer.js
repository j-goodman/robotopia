/*
PIPEDRAWER.JS
A helper function to handle the drawing of pipes so that they connect
to one another properly.
*/

function drawPipe (i, j, viewport) {
  // Choose the correct sprite to represent the pipe at a given space.
  var pipeKind = '';
  if (game.tileData[game.grid[i - 1][j].type].pipable) { pipeKind += 'a'; }
  if (game.tileData[game.grid[i][j + 1].type].pipable) { pipeKind += 'b'; }
  if (game.tileData[game.grid[i + 1][j].type].pipable) { pipeKind += 'c'; }
  if (game.tileData[game.grid[i][j - 1].type].pipable) { pipeKind += 'd'; }
  game.ctx.drawImage(pipeSprites[pipeKind], (j - viewport.origin.x) * 20, (i - viewport.origin.y) * 20);
}

var pipeSprites = {};
var pipe;
pipe = new Image (); pipe.src = 'tiles/pipes/off-a.png'; pipeSprites.a = pipe;
pipe = new Image (); pipe.src = 'tiles/pipes/off-b.png'; pipeSprites.b = pipe;
pipe = new Image (); pipe.src = 'tiles/pipes/off-c.png'; pipeSprites.c = pipe;
pipe = new Image (); pipe.src = 'tiles/pipes/off-d.png'; pipeSprites.d = pipe;
pipe = new Image (); pipe.src = 'tiles/pipes/off-ab.png'; pipeSprites.ab = pipe;
pipe = new Image (); pipe.src = 'tiles/pipes/off-ac.png'; pipeSprites.ac = pipe;
pipe = new Image (); pipe.src = 'tiles/pipes/off-ad.png'; pipeSprites.ad = pipe;
pipe = new Image (); pipe.src = 'tiles/pipes/off-bc.png'; pipeSprites.bc = pipe;
pipe = new Image (); pipe.src = 'tiles/pipes/off-bd.png'; pipeSprites.bd = pipe;
pipe = new Image (); pipe.src = 'tiles/pipes/off-cd.png'; pipeSprites.cd = pipe;
pipe = new Image (); pipe.src = 'tiles/pipes/off-abc.png'; pipeSprites.abc = pipe;
pipe = new Image (); pipe.src = 'tiles/pipes/off-abd.png'; pipeSprites.abd = pipe;
pipe = new Image (); pipe.src = 'tiles/pipes/off-acd.png'; pipeSprites.acd = pipe;
pipe = new Image (); pipe.src = 'tiles/pipes/off-bcd.png'; pipeSprites.bcd = pipe;
pipe = new Image (); pipe.src = 'tiles/pipes/off-abcd.png'; pipeSprites.abcd = pipe;
