var tileData = {
  'powerplant': {
    tag: 'powerplant',
    name: "Power plant",
    description: "A miniature nuclear reactor to provide energy for your glorious new robot society. Connect it to mechanisms that need power by building pipes.",
    pipable: true,
    builds: ['pipe'],
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
};
