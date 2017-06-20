/*
TILEDATA.JS
A data object to return information about various types of structure.
*/
var tileData = {
  'boulder': {
    tag: 'boulder',
    name: "Boulder",
    description: "It's a boulder. You could probably get it out of the way if you built a Destroyer.",
    pipeable: false,
    builds: false,
  },
  'deposit': {
    tag: 'deposit',
    name: "Energy Deposit",
    description: "A naturally occuring energy deposit. You can build a Extractor on an adjacent tile to extract energy from it until it runs out.",
    pipeable: false,
    builds: false,
  },
  'destroyer': {
    tag: 'destroyer',
    name: "Destroyer",
    description: "A giant stationary plasma-cannon. It's based on one of the old models used in the great Human Wars.",
    pipeable: true,
    builds: false,
  },
  'empty': {
    tag: 'empty',
    name: "Empty",
    description: "",
    pipeable: false,
    builds: false,
  },
  'pipe': {
    tag: 'pipe',
    name: "Pipe",
    description: "Compact insulated tubing to allow easy transmission of power and supplies across the arctic floor.",
    pipeable: true,
    builds: false,
  },
  'plasma': {
    tag: 'plasma',
    name: "Plasma",
    description: "",
    pipeable: false,
    builds: false,
  },
  'powerplant': {
    tag: 'powerplant',
    name: "Power Plant",
    description: "This is you. You're the AI controller of a miniature nuclear reactor. Anything that needs power needs to be connected to you by a pipe.",
    pipeable: true,
    builds: ['pipe', 'extractor', 'destroyer', 'researchStation'],
  },
  'researchStation': {
    tag: 'researchStation',
    name: "Research Station",
    description: "An advanced artificial intelligence scientific research station.",
    pipeable: true,
    builds: ['pipe', 'extractor'],
  },
  'extractor': {
    tag: 'deposit',
    name: "Extractor",
    description: "An automated salvage and resource extraction center.",
    pipeable: true,
    builds: ['pipe'],
  },
  'sea': {
    tag: 'sea',
    name: "Sea",
    description: "",
    pipeable: false,
    builds: false,
  },
};
