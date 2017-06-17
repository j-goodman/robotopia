/*
CURSOR.JS
The player's cursor. The cursor has multiple modes, each of which allows
the player to interact with their environment in a different way.

Cursor modes:
'selector'
'builder'
*/

var Cursor = function (game) {
  var rect;
  this.alpha = 1;
  this.baseImage = new Image ();
  this.baseImage.src = 'assets/cursor.png';
  this.game = game;
  this.game.cursor = this;
  this.image = this.baseImage;
  this.menuHover = false;
  this.mode = 'selector';
  rect = game.canvas.getBoundingClientRect();
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
  // When the window is resized, adjust the screenRatio so that the mouse
  // and DOM elements will line up with the canvas.
  rect = game.canvas.getBoundingClientRect();
  game.screenRatio = {
    left: rect.left,
    top: rect.top,
    x: (rect.right - rect.left) / game.canvas.width,
    y: (rect.bottom - rect.top) / game.canvas.height,
  };
};

Cursor.prototype.update = function (event) {
  // Update the cursor's position to reflect mouse input.
  var x; var y;
  x = Math.round(this.x / 20) + game.viewport.origin.x;
  y = Math.round(this.y / 20) + game.viewport.origin.y;
  this.x = event.clientX / game.screenRatio.x - game.settings.tileSize / 2;
  this.y = event.clientY / game.screenRatio.y - game.settings.tileSize / 2;
  if (Math.round(this.x / 20) + game.viewport.origin.x !== x || Math.round(this.y / 20) + game.viewport.origin.y !== y) {
    this.onMove();
  }
  game.ctx.globalAlpha = this.alpha;
  game.ctx.drawImage(this.image, Math.round(this.x / 20) * 20, Math.round(this.y / 20) * 20);
  game.ctx.globalAlpha = 1;
};

Cursor.prototype.onMove = function () {
  // Called when the cursor moves from one tile to another, checks for menus
  // or other interactions.
  var square;
  if (this.mode === 'selector') {
    this.image = this.baseImage;
    square = game.grid[Math.round(this.y / 20) + game.viewport.origin.y][Math.round(this.x / 20) + game.viewport.origin.x];
    if (game.tiles[square.type].hasMenu) {
      this.menuHover = true;
      if (!this.unlocked) {
        menus.displayMenu({
          type: game.grid[Math.round(this.y / 20) + game.viewport.origin.y][Math.round(this.x / 20) + game.viewport.origin.x].type,
          screenPos: {
            x: Math.round(this.x / 20),
            y: Math.round(this.y / 20),
          },
          square: square,
        });
      }
    } else {
      this.menuHover = false;
      if (!this.unlocked) {
        window.setTimeout(
          function () {
            if (!this.menuHover) {
              menus.hideMenu();
            }
          }.bind(this), 160
        );
      }
    }
  } else if (this.mode === 'builder') {
    if (game.builder.checkPlacement(this.building, {
      x: Math.round(this.x / 20) + game.viewport.origin.x,
      y: Math.round(this.y / 20) + game.viewport.origin.y,
    })) {
      this.alpha = 1;
    } else {
      this.alpha = 0.4;
    }
  }
};

Cursor.prototype.initialize = function () {
  // Add onclick event to let the player place structures in builder mode.
  game.canvas.onclick = function () {
    if (game.cursor.mode === 'builder') {
      game.builder.placeBuilding(this.building, {
        x: Math.round(this.x / 20) + game.viewport.origin.x,
        y: Math.round(this.y / 20) + game.viewport.origin.y,
      }, this.buildingNotes);
    }
  }.bind(this);
  game.enterPressed = game.canvas.onclick;
};
