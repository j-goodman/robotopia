var Destroyer = function (x, y) {
  game.grid[y][x].tenant = this;

  this.angle = 1;
  this.automatic = false;
  this.chargeable = true;
  this.charged = true;
  this.cycle = 0;
  this.destroyableStructures = ['empty', 'deposit', 'boulder', 'pipe', 'extractor', 'researchStation', 'destroyer', 'rootflower', 'root', 'strangler', 'chemicalPlant', 'contaminator', 'shipwreck', 'fusionReactor', 'munitionsFactory', 'nuclearResearchStation'];
  this.destructionSound = 'blast';
  this.modifier = false;
  this.range = 6;
  this.type = 'destroyer';

  this.pos = {
    x: x,
    y: y,
  };
};

Destroyer.prototype.rotate = function () {
  this.angle += 1;
  this.angle = this.angle > 3 ? 0 : this.angle;
  game.organ.play('roll');
};

Destroyer.prototype.fire = function () {
  game.organ.playIfVisible(this.pos, 'blast');
  var direction;
  var i;
  var place;
  var plasma;
  direction = {
    x: 0,
    y: 0,
  };
  place = {
    x: 0,
    y: 0,
  };
  if (!this.automatic) {
    menus.hideMenu();
  }
  if (this.angle === 0) { direction.y = -1; }
  if (this.angle === 1) { direction.x = 1; }
  if (this.angle === 2) { direction.y = 1; }
  if (this.angle === 3) { direction.x = -1; }
  for (i=1 ; i<this.range+1 ; i++) {
    setTimeout(function () {
      place.x += direction.x;
      place.y += direction.y;
      if (this.destroyableStructures.includes(game.grid[this.pos.y + place.y][this.pos.x + place.x].type)) {
        if (game.grid[this.pos.y + place.y][this.pos.x + place.x].poisoned) {
          game.grid[this.pos.y + place.y][this.pos.x + place.x].poisoned = !!Math.floor(Math.random() * 4);
        }
        if (
          game.grid[this.pos.y + place.y] &&
          game.grid[this.pos.y + place.y][this.pos.x + place.x] &&
          game.grid[this.pos.y + place.y][this.pos.x + place.x].tenant &&
          game.grid[this.pos.y + place.y][this.pos.x + place.x].tenant.destroy
        ) {
          game.grid[this.pos.y + place.y][this.pos.x + place.x].tenant.destroy();
        }
        plasma = new game.structures.lookup.plasma (this.pos.x + place.x, this.pos.y + place.y);
        game.structures.push(plasma);
        game.grid[this.pos.y + place.y][this.pos.x + place.x].type = 'plasma';
      } else if (game.grid[this.pos.y + place.y][this.pos.x + place.x].type === 'pipe') {
        var doNothing;
      } else {
        return false;
      }
    }.bind(this), 80 * i);
  }
};

Destroyer.prototype.adjustRange = function (element) {
  if (this.modifier === 'precisionDestroyer') {
    this.range -= 1;
    if (this.range === 0) {
      this.range = 5;
    }
    element.innerText = "Adjust Range [" + this.range + "]";
  }
};

Destroyer.prototype.apply = function (item) {
  if (item.tag === 'triggerpin') {
    game.organ.play('machinebuild');
    this.automatic = true;
    this.action = function () {
      this.cycle += 1;
      if (this.cycle > 90) {
        this.cycle = 0;
        this.fire();
      }
    };
  }
};

Destroyer.prototype.removeTriggerpin = function () {
  if (this.automatic) {
    this.automatic = false;
    this.action = undefined;
    menus.hideMenu();
    game.mainPowerplant.addToInventory(new Item ('triggerpin'));
  }
};

Destroyer.prototype.selfDestruct = function () {
  this.destroy();
};

Destroyer.prototype.onDestroy = function () {
  var pipe;
  var pipes;
  pipes = 0;
  if (game.grid[this.pos.y + 1][this.pos.x].type === 'pipe') { pipes += 1; }
  if (game.grid[this.pos.y][this.pos.x + 1].type === 'pipe') { pipes += 1; }
  if (game.grid[this.pos.y - 1][this.pos.x].type === 'pipe') { pipes += 1; }
  if (game.grid[this.pos.y][this.pos.x - 1].type === 'pipe') { pipes += 1; }
  if (pipes > 1) {
    pipe = new game.structures.lookup.pipe (this.pos.x, this.pos.y);
    game.structures.push(pipe);
    game.grid[this.pos.y][this.pos.x].type = 'pipe';
  }
  if (this.automatic) {
    game.mainPowerplant.addToInventory(new Item ('triggerpin'));
  }
};
