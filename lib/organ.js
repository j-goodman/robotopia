/*
ORGAN.JS
Handles all of the game's sound effects.
*/

var organ = {};

organ.initialize = function () {
  // Create all the the necessary sounds for the game as audio elements.

  this.createSoundElement('hammerfall', [
    {url: 'audio/hammerfall.ogg', filetype: 'audio/ogg'},
    {url: 'audio/hammerfall.wav', filetype: 'audio/wav'},
  ]);

  this.createSoundElement('twang', [
    {url: 'audio/twang.ogg', filetype: 'audio/ogg'},
    {url: 'audio/twang.wav', filetype: 'audio/wav'},
  ]);

  this.createSoundElement('wheelstop', [
    {url: 'audio/wheelstop.ogg', filetype: 'audio/ogg'},
    {url: 'audio/wheelstop.wav', filetype: 'audio/wav'},
  ]);

  this.createSoundElement('flush', [
    {url: 'audio/flush.ogg', filetype: 'audio/ogg'},
    {url: 'audio/flush.wav', filetype: 'audio/wav'},
  ]);

  this.createSoundElement('initialize', [
    {url: 'audio/initialize.ogg', filetype: 'audio/ogg'},
    {url: 'audio/initialize.wav', filetype: 'audio/wav'},
  ]);

  this.createSoundElement('blast', [
    {url: 'audio/blast.ogg', filetype: 'audio/ogg'},
    {url: 'audio/blast.wav', filetype: 'audio/wav'},
  ]);

  this.createSoundElement('roll', [
    {url: 'audio/roll.ogg', filetype: 'audio/ogg'},
    {url: 'audio/roll.wav', filetype: 'audio/wav'},
  ]);

  this.createSoundElement('machinebuild', [
    {url: 'audio/machinebuild.ogg', filetype: 'audio/ogg'},
    {url: 'audio/machinebuild.wav', filetype: 'audio/wav'},
  ]);

  this.createSoundElement('unsheath', [
    {url: 'audio/unsheath.ogg', filetype: 'audio/ogg'},
    {url: 'audio/unsheath.wav', filetype: 'audio/wav'},
  ]);

  this.createSoundElement('woodassemble', [
    {url: 'audio/woodassemble.ogg', filetype: 'audio/ogg'},
    {url: 'audio/woodassemble.wav', filetype: 'audio/wav'},
  ]);

  this.createSoundElement('plunk', [
    {url: 'audio/plunk.ogg', filetype: 'audio/ogg'},
    {url: 'audio/plunk.wav', filetype: 'audio/wav'},
  ]);

  this.createSoundElement('crunch', [
    {url: 'audio/crunch.ogg', filetype: 'audio/ogg'},
    {url: 'audio/crunch.wav', filetype: 'audio/wav'},
  ]);

  this.createSoundElement('crawl', [
    {url: 'audio/crawl.ogg', filetype: 'audio/ogg'},
    {url: 'audio/crawl.wav', filetype: 'audio/wav'},
  ]);

  this.createSoundElement('growth', [
    {url: 'audio/growth.ogg', filetype: 'audio/ogg'},
    {url: 'audio/growth.wav', filetype: 'audio/wav'},
  ]);

  this.createSoundElement('poison', [
    {url: 'audio/poison.ogg', filetype: 'audio/ogg'},
    {url: 'audio/poison.wav', filetype: 'audio/wav'},
  ]);
};

organ.createSoundElement = function (name, sources) {
  // Takes a name and a list of sources to create and append a DOM Audio
  // element. 'Sources' argument should be a list of objects:
  // {url: 'assets/sound.mp3', filetype: 'audio/mp3'}
  var element;
  var i;
  var soundorgan;
  var sound;
  var source;

  soundorgan = document.getElementById('organ');

  element = document.createElement('AUDIO');
  element.id = 'audio-' + name;
  for (i=0 ; i<sources.length ; i++) {
    source = document.createElement('SOURCE');
    source.src = sources[i].url;
    source.type = sources[i].filetype;
    element.appendChild(source);
  }

  soundorgan.appendChild(element);
};

organ.play = function (soundName) {
  // Takes the name of a sound and plays that audio element once.
  var audio;
  audio = document.getElementById('audio-' + soundName);
  audio.play();
};

organ.playIfVisible = function (position, soundName) {
  if (
    (position.x > game.viewport.origin.x && position.x < game.viewport.origin.x + game.settings.viewport.width) &&
    (position.y > game.viewport.origin.y && position.y < game.viewport.origin.y + game.settings.viewport.height)
  ) {
    this.play(soundName);
  }
};
