/*
NAVIGATOR.JS
Script to manage the keyevents that allow the user to freely explore the
game grid beyond the initial viewport position.
*/

window.onkeydown = function (event) {
  switch (event.keyCode) {
    case 38: // Up.
      if (game.viewport.origin.y > 0) {
        game.viewport.origin.y -= 1;
      }
      break;
    case 39: // Right.
      if (game.viewport.origin.x < game.settings.grid.width - game.settings.viewport.width) {
        game.viewport.origin.x += 1;
      }
      break;
    case 40: // Down.
      if (game.viewport.origin.y < game.settings.grid.height - game.settings.viewport.height) {
        game.viewport.origin.y += 1;
      }
      break;
    case 37: // Left.
      if (game.viewport.origin.x > 0) {
        game.viewport.origin.x -= 1;
      }
      break;
    case 27: // Escape.
      game.cursor.mode = 'selector';
      break;
    case 80: // P.
      builder.build(game.builder.builds.pipe);
      menus.hideMenu();
      break;
    case 13: // Enter.
      game.enterPressed();
      break;
  }
  game.cursor.onMove();
};
