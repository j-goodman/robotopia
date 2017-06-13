var windows = {};

windows.displayMenu = function (object) {
  var menu;
  var x; var y;
  menu = document.getElementById('menu');
  menu.style.display = 'block';
  x = game.screenRatio.left + object.screenPos.x * game.settings.tileSize * game.screenRatio.x + game.settings.tileSize * game.screenRatio.x;
  y = game.screenRatio.top + object.screenPos.y * game.settings.tileSize * game.screenRatio.y;
  menu.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
};

windows.hideMenu = function () {
  var menu;
  menu = document.getElementById('menu');
  menu.style.display = 'none';
};

windows.initialize = function () {
  var menu;
  menu = document.getElementById('menu');
  menu.onmouseenter = function () {
    game.cursor.menuHover = true;
    game.cursor.unlocked = true;
  };
  menu.onmouseleave = function () {
    game.cursor.menuHover = false;
    game.cursor.unlocked = false;
  };
};
