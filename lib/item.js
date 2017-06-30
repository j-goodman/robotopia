var Item = function (tag) {
  this.tag = tag;
};

Item.prototype.use = function () {
  menus.hideMenu();
  game.cursor.mode = 'item';
  game.cursor.item = game.itemData[this.tag];
};

var itemData = {
  triggerpin: {
    applications: ['destroyer'],
    description: "A device from the great Human Wars. Apply it to a Destroyer to automate its firing.",
    image: new Image (),
    name: "Automated Trigger Pin",
    tag: 'triggerpin',
  }
};

itemData.triggerpin.image.src = 'tiles/items/triggerpin.png';
