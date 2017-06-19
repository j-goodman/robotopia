var mapbuilder = {};

mapbuilder.buildGrid = function () {
  // var grid;
  // var square;
  // grid = [];
  // for (i=0 ; i<game.settings.grid.height ; i++) {
  //   row = [];
  //   for (j=0 ; j<game.settings.grid.width ; j++) {
  //     if (i === 0 || i === game.settings.grid.height - 1 ||
  //       j === 0 || j === game.settings.grid.width - 1) {
  //         row.push(new Square ({type: 'sea'}, j, i));
  //       } else {
  //         square = new Square ({type: 'empty'}, j, i);
  //         // square = new Square ({type: 'boulder'}, j, i);
  //         // object = new game.structures.lookup.boulder (j, i);
  //         // game.structures.push(object);
  //         // square.tenant = object;
  //         row.push(square);
  //       }
  //       console.log(row);
  //   }
  //   grid.push(row);
  // }
  // return grid;
};

mapbuilder.buildGrid = function () {
  var grid;
  grid = [];
  for (i=0 ; i<game.settings.grid.height ; i++) {
    row = [];
    for (j=0 ; j<game.settings.grid.width ; j++) {
      if (i === 0 || i === game.settings.grid.height - 1 ||
        j === 0 || j === game.settings.grid.width - 1) {
          row.push(new Square ({type: 'sea'}, j, i));
        } else {
          if (Math.floor(Math.random() * game.settings.depositRarity)) {
            row.push(new Square ({type: 'empty'}, j, i));
          } else if (!Math.floor(Math.random() * game.settings.boulderRarity)) {
            square = new Square ({type: 'boulder'}, j, i);
            for (k=0 ; k<12 ; k++) {
              random = {
                x: Math.round(Math.random() * 2),
                y: Math.round(Math.random() * 2),
              };
              if (grid[i - k * random.x] &&
                grid[i - k * random.x][j - k * random.y] &&
                grid[i - k * random.x]
                [j - k * random.y].type === 'empty'
              ) {
                grid[i - k * random.x][j - k * random.y].type = 'boulder';
                object = new game.structures.lookup.boulder (j, i);
                game.structures.push(object);
                square.tenant = object;
              }
            }
            object = new game.structures.lookup.boulder (j, i);
            game.structures.push(object);
            square.tenant = object;
            row.push(square);
          } else {
            square = new Square ({type: 'deposit'}, j, i);
            object = new game.structures.lookup.deposit (j, i);
            game.structures.push(object);
            square.tenant = object;
            row.push(square);
          }
        }
    }
    grid.push(row);
  }
  return grid;
};
