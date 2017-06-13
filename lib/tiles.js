loadTiles = function () {
  game.tiles = {};
  makeTile('empty', false, game);
  makeTile('powerplant', true, game);
};

function makeTile (name, menu, game) {
  game.tiles[name] = new Image ();
  game.tiles[name].hasMenu = menu;
  game.tiles[name].src = 'tiles/' + name + '.png';
}
