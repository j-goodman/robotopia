/*
TILES.JS
Tiles are the images which are used to represent objects on the gameboard.
*/
loadTiles = function () {
  // Load images.
  game.tiles = {};
  makeTile('boulder', true, game);
  game.tiles.chemicalPlant = new Image ();
  game.tiles.chemicalPlant.src = 'tiles/researchStation/chemicalPlant-military.png';
  game.tiles.chemicalPlant.hasMenu = true;
  makeTile('contaminator', true, game);
  makeTile('deposit', true, game);
  makeTile('destroyer', true, game);
  makeTile('empty', false, game);
  makeTile('extractor', true, game);
  game.tiles.pipe = new Image ();
  game.tiles.pipe.src = 'tiles/pipes/off-abcd.png';
  game.tiles.pipe.hasMenu = false;
  makeTile('plasma', false, game);
  makeTile('poisoned', false, game);
  makeTile('powerplant', true, game);
  makeTile('researchStation', true, game);
  game.tiles.root = new Image ();
  game.tiles.root.src = 'tiles/kudzu/kudzu-0.png';
  game.tiles.root.hasMenu = false;
  makeTile('rootflower', true, game);
  makeTile('sea', false, game);
  makeTile('shipwreck', true, game);
  game.tiles.strangler = new Image ();
  game.tiles.strangler.src = 'tiles/kudzu/kudzu-0.png';
  game.tiles.strangler.hasMenu = true;
  makeTile('superExtractor', false, game);

};

function makeTile (name, menu, game) {
  // Shorthand to load an image with a standard filename structure.
  game.tiles[name] = new Image ();
  game.tiles[name].hasMenu = menu;
  game.tiles[name].src = 'tiles/' + name + '.png';
}
