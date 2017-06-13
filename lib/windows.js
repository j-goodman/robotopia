var windows = {};

windows.displayMenu = function (object) {
  var build;
  var content;
  var description;
  var menu;
  var name;
  var saveContent;
  var x; var y;
  if (game.cursor.unlocked) { return false; }
  game.cursor.unlocked = true;
  content = document.getElementById('menu-list');
  content.innerHTML = "<li id='menu-description'>Description</li><li id='menu-build'>Build</li>";
  build = document.getElementById('menu-build');
  description = document.getElementById('menu-description');
  menu = document.getElementById('menu');
  name = document.getElementById('menu-name');
  menu.style.display = 'block';
  name.innerText = game.tileData[object.type].name;
  x = game.screenRatio.left + object.screenPos.x * game.settings.tileSize * game.screenRatio.x + game.settings.tileSize * game.screenRatio.x;
  y = game.screenRatio.top + object.screenPos.y * game.settings.tileSize * game.screenRatio.y;
  menu.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

  description.onclick = function () {
    var par;
    saveContent = content.innerHTML;
    content.innerHTML = '<li class="left-align" id="menu-description-paragraph">' + game.tileData[object.type].description + '</li>';
    par = document.getElementById('menu-description-paragraph');
    par.onclick = function () {
      this.element.innerHTML = this.content;
      document.getElementById('menu-build').onclick = build.onclick;
      document.getElementById('menu-description').onclick = this.onclick;
    }.bind({content: saveContent, element: content, onclick: description.onclick});
  };

  if (game.tileData[object.type].builds) {
    build.onclick = function () {
      saveContent = content.innerHTML;
      this.buildBuildMenu(
        game.tileData[object.type].builds,
        function () {
          this.element.innerHTML = this.content;
          document.getElementById('menu-build').onclick = this.onclick;
          document.getElementById('menu-description').onclick = description.onclick;
        }.bind({content: saveContent, element: content, onclick: build.onclick})
      );
    }.bind(this);
  } else {
    build.style.display = 'none';
  }
};

windows.buildBuildMenu = function (builds, returnFunction) {
  var button;
  var content;
  var i;
  content = document.getElementById('menu-list');
  content.innerHTML = '';
  for (i=0 ; i<builds.length ; i++) {
    button = document.createElement('LI');
    button.innerText = game.builder.builds[builds[i]].name;
    content.appendChild(button);
    button.onclick = function () {
      game.builder.build(this);
      windows.hideMenu();
    }.bind(game.builder.builds[builds[i]]);
  }
  button = document.createElement('LI');
  button.innerText = "⬅";
  button.onclick = returnFunction;
  content.appendChild(button);
};

windows.hideMenu = function () {
  var menu;
  menu = document.getElementById('menu');
  game.cursor.unlocked = false;
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
