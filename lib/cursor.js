/*
CURSOR.JS
The player's cursor. The cursor has multiple modes, each of which allows
the player to interact with their environment in a different way.

Cursor modes:
'selector'
'builder'
'item'
*/

var Cursor = function (game) {
  var rect;
  this.alpha = 1;
  this.baseImage = new Image ();
  this.baseImage.src = 'assets/cursor.png';
  this.building = null;
  this.item = null;
  this.pointerImage = new Image ();
  this.pointerImage.src = 'assets/pointer.png';
  this.hoverPointerImage = new Image ();
  this.hoverPointerImage.src = 'assets/hover-pointer.png';
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
  if (this.menuHover) {
    game.ctx.drawImage(this.hoverPointerImage, this.x + 8, this.y + 8);
  } else {
    game.ctx.drawImage(this.pointerImage, this.x + 8, this.y + 8);
  }
  if (game.time % 9 === 0 && !menus.isOpen) {
    if (x - game.viewport.origin.x === 0) {
      game.navigator.left();
    }
    if (x - game.viewport.origin.x === game.settings.viewport.width - 1) {
      game.navigator.right();
    }
    if (y - game.viewport.origin.y === 0) {
      game.navigator.up();
    }
    if (y - game.viewport.origin.y === game.settings.viewport.height - 1) {
      game.navigator.down();
    }
  }
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
    } else {
      this.menuHover = false;
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
  } else if (this.mode === 'item') {
    this.image = this.item.image;
    if (
      this.item.applications.includes(game.grid[Math.round(this.y / 20) + game.viewport.origin.y][Math.round(this.x / 20) + game.viewport.origin.x].type) ||
      this.item.applications[0] === 'all'
    ) {
      this.alpha = 1;
    } else {
      this.alpha = 0.4;
    }
  }
};

Cursor.prototype.initialize = function () {
  // Add onclick event to let the player place structures in builder mode.
  game.canvas.onclick = function () {
    var square;

    if (game.cursor.mode === 'builder') {
      game.builder.placeBuilding(this.building, {
        x: Math.round(this.x / 20) + game.viewport.origin.x,
        y: Math.round(this.y / 20) + game.viewport.origin.y,
      }, this.buildingNotes);
    } else if (game.cursor.mode === 'item') {
      if (this.item.applications.includes(
        game.grid[Math.round(this.y / 20) + game.viewport.origin.y][Math.round(this.x / 20) + game.viewport.origin.x].type
      )) {
        game.grid[Math.round(this.y / 20) + game.viewport.origin.y][Math.round(this.x / 20) + game.viewport.origin.x].tenant.apply(this.item);
        this.mode = 'selector';
        this.onMove();
        game.mainPowerplant.removeFromInventory(this.item.tag);
      } else if (this.item.tag === 'plasmabomb') {
        this.item.method(
          Math.round(this.x / 20) + game.viewport.origin.x,
          Math.round(this.y / 20) + game.viewport.origin.y
        );
        this.mode = 'selector';
        game.mainPowerplant.removeFromInventory(this.item.tag);
        this.onMove();
      } else {
        game.organ.play('twang');
        this.mode = 'selector';
        this.onMove();
      }
    } else {
      square = game.grid[Math.round(this.y / 20) + game.viewport.origin.y][Math.round(this.x / 20) + game.viewport.origin.x];
      if (game.tiles[square.type].hasMenu && !menus.isOpen) {
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
        menus.hideMenu();
      }
    }
  }.bind(this);
  game.enterPressed = game.canvas.onclick;
};

addEventListener('mousedown', event => {
    game.cursor.clickDown = true
    game.cursor.clickPos = {
        x: game.cursor.x,
        y: game.cursor.y
    }
})

addEventListener('mousemove', event => {
    if (game.cursor.clickDown) {
        let diff = {
            x: Math.floor(game.cursor.x - game.cursor.clickPos.x),
            y: Math.floor(game.cursor.y - game.cursor.clickPos.y),
        }

        let tile = game.settings.tileSize

        if (game.viewport.pixelOffset.x > tile) {
            game.cursor.clickPos.x = game.cursor.x
            diff.x = 0
            game.viewport.origin.x -= 1
        }
        if (game.viewport.pixelOffset.x < tile * -1) {
            game.cursor.clickPos.x = game.cursor.x
            diff.x = 0
            game.viewport.origin.x += 1
        }
        if (game.viewport.pixelOffset.y > tile) {
            game.cursor.clickPos.y = game.cursor.y
            diff.y = 0
            game.viewport.origin.y -= 1
        }
        if (game.viewport.pixelOffset.y < tile * -1) {
            game.cursor.clickPos.y = game.cursor.y
            diff.y = 0
            game.viewport.origin.y += 1
        }
        
        game.viewport.pixelOffset.x = diff.x
        game.viewport.pixelOffset.y = diff.y
        
        if (game.viewport.origin.x <= 0) {
            game.viewport.origin.x = 0
            game.viewport.pixelOffset.x = game.viewport.pixelOffset.x > 0 ? 0 : game.viewport.pixelOffset.x
        }
        
        if (game.viewport.origin.y <= 0) {
            game.viewport.origin.y = 0
            game.viewport.pixelOffset.y = game.viewport.pixelOffset.y > 0 ? 0 : game.viewport.pixelOffset.y
        }
        
        let xMax = game.settings.grid.width - game.viewport.width
        let yMax = game.settings.grid.height - game.viewport.height
        
        if (game.viewport.origin.x >= xMax) {
            game.viewport.origin.x = xMax
            game.viewport.pixelOffset.x = game.viewport.pixelOffset.x < 0 ? 0 : game.viewport.pixelOffset.x
        }
        
        if (game.viewport.origin.y >= yMax) {
            game.viewport.origin.y = yMax
            game.viewport.pixelOffset.y = game.viewport.pixelOffset.y < 0 ? 0 : game.viewport.pixelOffset.y
        }
    }
})

addEventListener('mouseup', event => {
    game.cursor.clickDown = false
})
