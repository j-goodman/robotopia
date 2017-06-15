/*
MENUS.JS
Manages the Menu element on the DOM, keeping it in sync with the canvas element.
*/

var menus = {};

menus.displayMenu = function (object) {
  // Make the menu element visible and populate it with the relevant information.
  var build;
  var content;
  var description;
  var element;
  var info;
  var menu;
  var name;
  var saveContent;
  var x; var y;
  if (game.cursor.unlocked) { return false; }
  content = document.getElementById('menu-list');
  game.menuSubject = object.square.tenant;
  content.innerHTML = "<li id='menu-description'>Describe</li><li id='menu-build'>Build</li><li id='menu-info' class='non-select'></li><li id='menu-info-two' class='non-select'></li>";
  build = document.getElementById('menu-build');
  description = document.getElementById('menu-description');
  menu = document.getElementById('menu');
  name = document.getElementById('menu-name');
  info = document.getElementById('menu-info');
  infoTwo = document.getElementById('menu-info-two');
  menu.style.display = 'block';
  name.innerText = game.tileData[object.type].name;
  x = game.screenRatio.left + object.screenPos.x * game.settings.tileSize * game.screenRatio.x + game.settings.tileSize * game.screenRatio.x;
  y = game.screenRatio.top + object.screenPos.y * game.settings.tileSize * game.screenRatio.y;
  if (x > window.innerWidth - 360) {
    x -= 320 + game.settings.tileSize * game.screenRatio.x;
  }
  if (y > window.innerHeight - 260) {
    y -= 100 + game.settings.tileSize * game.screenRatio.y;
  }
  menu.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

  switch (object.type) {
    case 'powerplant':
      info.innerText = "Total Energy: " + game.energy + "ᴊ";
      break;
    case 'salvageCamp':
      info.innerText = "Energy in Deposit: " + object.square.tenant.energyLeft() + "ᴊ";
      break;
    case 'destroyer':
      element = document.createElement('LI');
      element.id = 'menu-rotate';
      element.innerText = "Rotate";
      element.onclick = object.square.tenant.rotate.bind(object.square.tenant);
      content.appendChild(element);
      element = document.createElement('LI');
      element.id = 'menu-fire';
      element.innerText = "Fire";
      element.onclick = object.square.tenant.fire.bind(object.square.tenant);
      content.appendChild(element);
      element = document.createElement('LI');
      element.id = 'menu-destruct';
      element.innerText = "Self Destruct";
      element.onclick = object.square.tenant.selfDestruct.bind(object.square.tenant);
      content.appendChild(element);
      break;
  }

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

menus.buildBuildMenu = function (builds, returnFunction) {
  // Construct a 'build' menu for a given list of structures.
  var button;
  var content;
  var i;
  content = document.getElementById('menu-list');
  content.innerHTML = '';
  for (i=0 ; i<builds.length ; i++) {
    button = document.createElement('LI');
    button.innerText = game.builder.builds[builds[i]].name + ' ' + game.builder.builds[builds[i]].cost + "ᴊ";
    content.appendChild(button);
    button.onclick = function () {
      if (this.object.cost > game.energy) {
        this.button.innerText = "That's too expensive.";
      } else {
        game.builder.build(this.object);
        menus.hideMenu();
      }
    }.bind({object: game.builder.builds[builds[i]], button: button});
  }
  button = document.createElement('LI');
  button.innerText = "⬅";
  button.onclick = returnFunction;
  content.appendChild(button);
};

menus.hideMenu = function () {
  // Hide the menu element.
  var menu;
  menu = document.getElementById('menu');
  game.cursor.unlocked = false;
  menu.style.display = 'none';
};

menus.initialize = function () {
  // Setup mouse enter and leave events for the menu element.
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
