window.onkeydown = function (event) {
  switch (event.keyCode) {
    case 38:
      if (game.viewport.origin.y > 0) {
        game.viewport.origin.y -= 1;
      }
      break;
    case 39:
      if (game.viewport.origin.x < game.settings.grid.width - game.settings.viewport.width) {
        game.viewport.origin.x += 1;
      }
      break;
    case 40:
      if (game.viewport.origin.y < game.settings.grid.height - game.settings.viewport.height) {
        game.viewport.origin.y += 1;
      }
      break;
    case 37:
      if (game.viewport.origin.x > 0) {
        game.viewport.origin.x -= 1;
      }
      break;
  }
  game.cursor.onMove();
};
