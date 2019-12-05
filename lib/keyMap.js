/*
NAVIGATOR.JS
Script to manage the keyevents that allow the user to freely explore the
game grid beyond the initial viewport position.
*/

window.onkeydown = function (event) {
  console.log(event.keyCode)
  switch (event.keyCode) {
    case 38: // Up.
    case 87: // W.
      game.navigator.up();
      break;
    case 39: // Right.
    case 68: // D.
      game.navigator.right();
      break;
    case 40: // Down.
    case 83: // S.
      game.navigator.down();
      break;
    case 37: // Left.
    case 65: // A.
      game.navigator.left();
      break;
    case 27: // Escape.
      game.cursor.mode = 'selector';
      menus.hideMenu();
      break;
    case 80: // P.
      builder.build(game.builder.builds.pipe);
      menus.hideMenu();
      break;
    case 69: // E.
      builder.build(game.builder.builds.extractor);
      menus.hideMenu();
      break;
    case 13: // Enter.
      game.enterPressed();
      break;
  }
  game.cursor.onMove();
};

var navigator = {};
navigator.left = function () {
  if (game.viewport.origin.x > 0) {
    game.viewport.origin.x -= 1;
    menus.hideMenu();
    return true;
  }
};
navigator.right = function () {
  if (game.viewport.origin.x < game.settings.grid.width - game.settings.viewport.width) {
    game.viewport.origin.x += 1;
    menus.hideMenu();
    return true;
  }
};
navigator.up = function () {
  if (game.viewport.origin.y > 0) {
    game.viewport.origin.y -= 1;
    menus.hideMenu();
    return true;
  }
};
navigator.down = function () {
  if (game.viewport.origin.y < game.settings.grid.height - game.settings.viewport.height) {
    game.viewport.origin.y += 1;
    menus.hideMenu();
    return true;
  }
};
