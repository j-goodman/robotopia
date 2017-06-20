/*
TILES.JS
Tiles are the images which are used to represent objects on the gameboard.
*/
loadTiles = function () {
  // Load images.
  game.tiles = {};
  makeTile('empty', false, game);
  makeTile('sea', false, game);
  makeTile('powerplant', true, game);
  makeTile('deposit', true, game);
  makeTile('extractor', true, game);
  makeTile('destroyer', true, game);
  makeTile('researchStation', true, game);
  makeTile('boulder', true, game);
  makeTile('plasma', false, game);
  makeTile('flower', true, game);
  game.tiles.pipe = new Image ();
  game.tiles.pipe.src = 'tiles/pipes/off-abcd.png';
  game.tiles.pipe.hasMenu = false;

};

function makeTile (name, menu, game) {
  // Shorthand to load an image with a standard filename structure.
  game.tiles[name] = new Image ();
  game.tiles[name].hasMenu = menu;
  game.tiles[name].src = 'tiles/' + name + '.png';
}
