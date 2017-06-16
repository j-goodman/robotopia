/*
SQUARE.JS
The Square is the fundamental gameboard object, it has a type that describes
what kind of structure exists in that space.
*/

var Square = function (object, x, y) {
  this.type = object.type;
  this.checks = {};
  this.tenant = null;
  this.pos = {
    x: x,
    y: y,
  };
};
