var Cursor = function (game) {
  var rect;
  this.game = game;
  this.game.cursor = this;
  this.baseImage = new Image ();
  this.baseImage.src = 'assets/cursor.png';
  this.image = this.baseImage;
  rect = game.canvas.getBoundingClientRect();
  this.menuHover = false;
  game.screenRatio = {
    left: rect.left,
    top: rect.top,
    x: (rect.right - rect.left) / game.canvas.width,
    y: (rect.bottom - rect.top) / game.canvas.height,
  };
  this.pos = {
    x: 50,
    y: 50,
  };
};

window.onresize = function () {
  rect = game.canvas.getBoundingClientRect();
  game.screenRatio = {
    left: rect.left,
    top: rect.top,
    x: (rect.right - rect.left) / game.canvas.width,
    y: (rect.bottom - rect.top) / game.canvas.height,
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
};

Cursor.prototype.onMove = function () {
  if (this.unlocked) { return false; }
  if (game.tiles[game.grid[Math.round(this.y / 20) + game.viewport.origin.y][Math.round(this.x / 20) + game.viewport.origin.x].type].hasMenu) {
    this.menuHover = true;
    windows.displayMenu({
      type: game.grid[Math.round(this.y / 20) + game.viewport.origin.y][Math.round(this.x / 20) + game.viewport.origin.x].type,
      screenPos: {
        x: Math.round(this.x / 20),
        y: Math.round(this.y / 20),
      }
    });
  } else {
    this.menuHover = false;
    window.setTimeout(
      function () {
        if (!this.menuHover) {
          windows.hideMenu();
        }
      }.bind(this), 250
    );
  }
};
