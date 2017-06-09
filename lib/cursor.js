var Cursor = function (game) {
  this.game = game;
  this.image = new Image ();
  this.image.src = 'assets/cursor.png';
  this.pos = {
    x: 50,
    y: 50,
  };
};

Cursor.prototype.update = function (event) {
  this.x = event.clientX;
  this.y = event.clientY;
  game.ctx.drawImage(this.image, this.x, this.y);
};
