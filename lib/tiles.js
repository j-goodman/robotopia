loadTiles = function () {
  game.tiles = {};
  makeTile('empty', false, game);
  makeTile('powerplant', true, game);
  game.tiles.pipe = new Image ();
  game.tiles.pipe.src = 'tiles/pipes/off-abcd.png';
  game.tiles.pipe.hasMenu = false;
};

function makeTile (name, menu, game) {
  game.tiles[name] = new Image ();
  game.tiles[name].hasMenu = menu;
  game.tiles[name].src = 'tiles/' + name + '.png';
}
