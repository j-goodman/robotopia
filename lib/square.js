/*
SQUARE.JS
The Square is the fundamental gameboard object, it has a type that describes
what kind of structure exists in that space.
*/

var Square = function (object) {
  this.type = object.type;
  this.tenant = null;
};
