/*
ORGAN.JS
Handles all of the game's sound effects.
*/

var organ = {};

organ.initialize = function () {
  // Create all the the necessary sounds for the game as audio elements.
  var soundorgan;
  var sound;
  soundorgan = document.getElementById('organ');

  sound = this.createSoundElement('hammerfall', [
    {url: 'audio/hammerfall.ogg', filetype: 'audio/ogg'},
    {url: 'audio/hammerfall.wav', filetype: 'audio/wav'},
  ]);
  soundorgan.appendChild(sound);

  sound = this.createSoundElement('twang', [
    {url: 'audio/twang.ogg', filetype: 'audio/ogg'},
    {url: 'audio/twang.wav', filetype: 'audio/wav'},
  ]);
  soundorgan.appendChild(sound);

  sound = this.createSoundElement('wheelstop', [
    {url: 'audio/wheelstop.ogg', filetype: 'audio/ogg'},
    {url: 'audio/wheelstop.wav', filetype: 'audio/wav'},
  ]);
  soundorgan.appendChild(sound);
};

organ.createSoundElement = function (name, sources) {
  // Takes a name and a list of sources to create a DOM Audio element.
  // 'sources' argument should be a list of objects:
  // {
  //   url: 'assets/sound.mp3',
  //   filetype: 'audio/mp3',
  // }
  var element;
  var i;
  var source;
  element = document.createElement('AUDIO');
  element.id = 'audio-' + name;
  for (i=0 ; i<sources.length ; i++) {
    source = document.createElement('SOURCE');
    source.src = sources[i].url;
    source.type = sources[i].filetype;
    element.appendChild(source);
  }
  return element;
};

organ.play = function (soundName) {
  // Takes the name of a sound and plays that audio element once.
  var audio;
  audio = document.getElementById('audio-' + soundName);
  audio.play();
};
