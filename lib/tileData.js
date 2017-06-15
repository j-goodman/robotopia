/*
TILEDATA.JS
A data object to return information about various types of structure.
*/
var tileData = {
  'powerplant': {
    tag: 'powerplant',
    name: "Power plant",
    description: "A miniature nuclear reactor to provide energy for your glorious new robot society. Connect it to mechanisms that need power by building pipes.",
    pipable: true,
    builds: ['pipe', 'salvageCamp'],
  },
  'pipe': {
    tag: 'pipe',
    name: "Pipe",
    description: "Insulated tubing to allow easy transmission of power and supplies across the arctic floor.",
    pipable: true,
    builds: false,
  },
  'empty': {
    tag: 'empty',
    name: "Empty",
    description: "",
    pipable: false,
    builds: false,
  },
  'deposit': {
    tag: 'deposit',
    name: "Energy Deposit",
    description: "A naturally occuring energy deposit. You can build a Salvage Camp on an adjacent tile to extract energy from it.",
    pipable: false,
    builds: false,
  },
  'salvageCamp': {
    tag: 'deposit',
    name: "Salvage Camp",
    description: "An automated salvage and resource extraction center.",
    pipable: true,
    builds: ['pipe'],
  },
};
