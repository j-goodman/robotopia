loadTiles = function () {
  game.tiles = {};
  makeTile('empty', game);
  makeTile('powerplant', game);
};

function makeTile (name, game) {
  game.tiles[name] = new Image ();
  game.tiles[name].src = 'tiles/' + name + '.png';
}
