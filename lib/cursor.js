var Cursor = function (game) {
  var rect;
  this.game = game;
  this.baseImage = new Image ();
  this.baseImage.src = 'assets/cursor.png';
  this.image = this.baseImage;
  rect = canvas.getBoundingClientRect();
  game.screenRatio = {
    x: (rect.right - rect.left) / game.canvas.width,
    y: (rect.bottom - rect.top) / game.canvas.height,
  };
  this.pos = {
    x: 50,
    y: 50,
  };
};

Cursor.prototype.update = function (event) {
  var x; var y;
  x = Math.round(this.x / 20) + game.viewport.origin.x;
  y = Math.round(this.y / 20) + game.viewport.origin.y;
  this.x = event.clientX / game.screenRatio.x;
  this.y = event.clientY / game.screenRatio.y;
  if (Math.round(this.x / 20) + game.viewport.origin.x !== x || Math.round(this.y / 20) + game.viewport.origin.y !== y) {
    this.onMove();
  }
  game.ctx.drawImage(this.image, Math.round(this.x / 20) * 20, Math.round(this.y / 20) * 20);
  // console.log(game.grid[Math.round(this.y / 20) + game.viewport.origin.y][Math.round(this.x / 20) + game.viewport.origin.x].type);
};

Cursor.prototype.onMove = function () {
  console.log("Sir, we're detecting a massive object emerging from hyperspace.");
};
