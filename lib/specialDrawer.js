/*
SPECIALDRAWER.JS
A helper function to handle the drawing of pipes, destroyers, and other
structures whose sprite depends on their in-game status.
*/

function drawPipe (i, j, viewport) {
  // Choose the correct sprite to represent the pipe at a given space.
  var pipeKind = '';
  if (game.tileData[game.grid[i - 1][j].type].pipeable) { pipeKind += 'a'; }
  if (game.tileData[game.grid[i][j + 1].type].pipeable) { pipeKind += 'b'; }
  if (game.tileData[game.grid[i + 1][j].type].pipeable) { pipeKind += 'c'; }
  if (game.tileData[game.grid[i][j - 1].type].pipeable) { pipeKind += 'd'; }
  if (pipeKind === '') { pipeKind = i % 2 === 0 ? 'bd' : 'ac'; }
  game.ctx.drawImage(pipeSprites[pipeKind], (j - viewport.origin.x) * 20, (i - viewport.origin.y) * 20);
}

var pipeSprites = {};
var pipe;
pipe = new Image (); pipe.src = 'tiles/pipes/off-a.png'; pipeSprites.a = pipe;
pipe = new Image (); pipe.src = 'tiles/pipes/off-b.png'; pipeSprites.b = pipe;
pipe = new Image (); pipe.src = 'tiles/pipes/off-c.png'; pipeSprites.c = pipe;
pipe = new Image (); pipe.src = 'tiles/pipes/off-d.png'; pipeSprites.d = pipe;
pipe = new Image (); pipe.src = 'tiles/pipes/off-ab.png'; pipeSprites.ab = pipe;
pipe = new Image (); pipe.src = 'tiles/pipes/off-ac.png'; pipeSprites.ac = pipe;
pipe = new Image (); pipe.src = 'tiles/pipes/off-ad.png'; pipeSprites.ad = pipe;
pipe = new Image (); pipe.src = 'tiles/pipes/off-bc.png'; pipeSprites.bc = pipe;
pipe = new Image (); pipe.src = 'tiles/pipes/off-bd.png'; pipeSprites.bd = pipe;
pipe = new Image (); pipe.src = 'tiles/pipes/off-cd.png'; pipeSprites.cd = pipe;
pipe = new Image (); pipe.src = 'tiles/pipes/off-abc.png'; pipeSprites.abc = pipe;
pipe = new Image (); pipe.src = 'tiles/pipes/off-abd.png'; pipeSprites.abd = pipe;
pipe = new Image (); pipe.src = 'tiles/pipes/off-acd.png'; pipeSprites.acd = pipe;
pipe = new Image (); pipe.src = 'tiles/pipes/off-bcd.png'; pipeSprites.bcd = pipe;
pipe = new Image (); pipe.src = 'tiles/pipes/off-abcd.png'; pipeSprites.abcd = pipe;

function drawRoot (i, j, viewport) {
  // Choose the correct sprite to represent the root at a given space.
  var rootKind = '';
  if (game.tileData[game.grid[i - 1][j].type].rootable) { rootKind += 'a'; }
  if (game.tileData[game.grid[i][j + 1].type].rootable) { rootKind += 'b'; }
  if (game.tileData[game.grid[i + 1][j].type].rootable) { rootKind += 'c'; }
  if (game.tileData[game.grid[i][j - 1].type].rootable) { rootKind += 'd'; }
  if (rootKind === '') { rootKind = '0'; }
  game.ctx.drawImage(rootSprites[rootKind], (j - viewport.origin.x) * 20, (i - viewport.origin.y) * 20);
}

var rootSprites = {};
var sprite;
sprite = new Image (); sprite.src = 'tiles/kudzu/kudzu-a.png'; rootSprites.a = sprite;
sprite = new Image (); sprite.src = 'tiles/kudzu/kudzu-b.png'; rootSprites.b = sprite;
sprite = new Image (); sprite.src = 'tiles/kudzu/kudzu-c.png'; rootSprites.c = sprite;
sprite = new Image (); sprite.src = 'tiles/kudzu/kudzu-d.png'; rootSprites.d = sprite;
sprite = new Image (); sprite.src = 'tiles/kudzu/kudzu-ab.png'; rootSprites.ab = sprite;
sprite = new Image (); sprite.src = 'tiles/kudzu/kudzu-ac.png'; rootSprites.ac = sprite;
sprite = new Image (); sprite.src = 'tiles/kudzu/kudzu-ad.png'; rootSprites.ad = sprite;
sprite = new Image (); sprite.src = 'tiles/kudzu/kudzu-bc.png'; rootSprites.bc = sprite;
sprite = new Image (); sprite.src = 'tiles/kudzu/kudzu-bd.png'; rootSprites.bd = sprite;
sprite = new Image (); sprite.src = 'tiles/kudzu/kudzu-cd.png'; rootSprites.cd = sprite;
sprite = new Image (); sprite.src = 'tiles/kudzu/kudzu-abc.png'; rootSprites.abc = sprite;
sprite = new Image (); sprite.src = 'tiles/kudzu/kudzu-abd.png'; rootSprites.abd = sprite;
sprite = new Image (); sprite.src = 'tiles/kudzu/kudzu-acd.png'; rootSprites.acd = sprite;
sprite = new Image (); sprite.src = 'tiles/kudzu/kudzu-bcd.png'; rootSprites.bcd = sprite;
sprite = new Image (); sprite.src = 'tiles/kudzu/kudzu-abcd.png'; rootSprites.abcd = sprite;
sprite = new Image (); sprite.src = 'tiles/kudzu/kudzu-0.png'; rootSprites['0'] = sprite;

function drawSuperExtractor (i, j, viewport) {
  game.ctx.drawImage(game.tiles.superExtractor, (j - viewport.origin.x) * 20, (i - viewport.origin.y) * 20);
}

function drawDestroyer (i, j, viewport) {
  var image;
  var spriteName;
  spriteName = game.grid[i][j].tenant.angle.toString();
  if (game.grid[i][j].tenant.modifier) {
    spriteName += '-' + game.grid[i][j].tenant.modifier;
  }
  image = destroyerSprites[spriteName];
  game.ctx.drawImage(image, (j - viewport.origin.x) * 20, (i - viewport.origin.y) * 20);
}

var destroyerSprites = {};
var sprite;
sprite = new Image (); sprite.src = 'tiles/destroyers/destroyer-0.png'; destroyerSprites[0] = sprite;
sprite = new Image (); sprite.src = 'tiles/destroyers/destroyer-1.png'; destroyerSprites[1] = sprite;
sprite = new Image (); sprite.src = 'tiles/destroyers/destroyer-2.png'; destroyerSprites[2] = sprite;
sprite = new Image (); sprite.src = 'tiles/destroyers/destroyer-3.png'; destroyerSprites[3] = sprite;
sprite = new Image (); sprite.src = 'tiles/destroyers/superDestroyer-0.png'; destroyerSprites['0-superDestroyer'] = sprite;
sprite = new Image (); sprite.src = 'tiles/destroyers/superDestroyer-1.png'; destroyerSprites['1-superDestroyer'] = sprite;
sprite = new Image (); sprite.src = 'tiles/destroyers/superDestroyer-2.png'; destroyerSprites['2-superDestroyer'] = sprite;
sprite = new Image (); sprite.src = 'tiles/destroyers/superDestroyer-3.png'; destroyerSprites['3-superDestroyer'] = sprite;
sprite = new Image (); sprite.src = 'tiles/destroyers/precisionDestroyer-0.png'; destroyerSprites['0-precisionDestroyer'] = sprite;
sprite = new Image (); sprite.src = 'tiles/destroyers/precisionDestroyer-1.png'; destroyerSprites['1-precisionDestroyer'] = sprite;
sprite = new Image (); sprite.src = 'tiles/destroyers/precisionDestroyer-2.png'; destroyerSprites['2-precisionDestroyer'] = sprite;
sprite = new Image (); sprite.src = 'tiles/destroyers/precisionDestroyer-3.png'; destroyerSprites['3-precisionDestroyer'] = sprite;

function drawRootflower (i, j, viewport) {
  var image;
  var spriteName;
  var resistant;
  resistant = game.grid[i][j].tenant.resistant;
  image = resistant ? rootflowerSprites.resistant : rootflowerSprites.default;
  game.ctx.drawImage(image, (j - viewport.origin.x) * 20, (i - viewport.origin.y) * 20);
}

var rootflowerSprites = {};
sprite = new Image (); sprite.src = 'tiles/rootflower.png'; rootflowerSprites.default = sprite;
sprite = new Image (); sprite.src = 'tiles/resistantRootflower.png'; rootflowerSprites.resistant = sprite;

function drawResearchStation (i, j, viewport) {
  var image;
  image = researchStationSprites[game.grid[i][j].tenant.specialty];
  game.ctx.drawImage(image, (j - viewport.origin.x) * 20, (i - viewport.origin.y) * 20);
}

var researchStationSprites = {};
sprite = new Image (); sprite.src = 'tiles/researchStations/researchStation-basic.png'; researchStationSprites.basic = sprite;
sprite = new Image (); sprite.src = 'tiles/researchStations/researchStation-military.png'; researchStationSprites.military = sprite;
sprite = new Image (); sprite.src = 'tiles/researchStations/researchStation-civilian.png'; researchStationSprites.civilian = sprite;

function drawChemicalPlant (i, j, viewport) {
  var image;
  image = chemicalPlantSprites[game.grid[i][j].tenant.specialty];
  game.ctx.drawImage(image, (j - viewport.origin.x) * 20, (i - viewport.origin.y) * 20);
}

var chemicalPlantSprites = {};
sprite = new Image (); sprite.src = 'tiles/researchStations/chemicalPlant-military.png'; chemicalPlantSprites.military = sprite;
sprite = new Image (); sprite.src = 'tiles/researchStations/chemicalPlant-civilian.png'; chemicalPlantSprites.civilian = sprite;


function drawStrangler (i, j, viewport) {
  // Choose the correct sprite to represent the strangler at a given space.
  var k;
  var letters;
  var pipeKind = '';
  var rootKinds = [];
  var square;

  if (game.tileData[game.grid[i - 1][j].type].pipeable) { pipeKind += 'a'; }
  if (game.tileData[game.grid[i][j + 1].type].pipeable) { pipeKind += 'b'; }
  if (game.tileData[game.grid[i + 1][j].type].pipeable) { pipeKind += 'c'; }
  if (game.tileData[game.grid[i][j - 1].type].pipeable) { pipeKind += 'd'; }
  square = game.tileData[game.grid[i - 1][j].type];
  if (square.rootable && !square.pipeable) { rootKinds.push('a'); }
  square = game.tileData[game.grid[i][j + 1].type];
  if (square.rootable && !square.pipeable) { rootKinds.push('b'); }
  square = game.tileData[game.grid[i + 1][j].type];
  if (square.rootable && !square.pipeable) { rootKinds.push('c'); }
  square = game.tileData[game.grid[i][j - 1].type];
  if (square.rootable && !square.pipeable) { rootKinds.push('d'); }

  if (pipeKind === '' || rootKinds.length === 0) {
    letters = ['a', 'b', 'c', 'd'];
    for (k=0 ; k<4 ; k++) {
      if (!rootKinds.includes(letters[k])) {
        pipeKind = letters[k];
      }
    }
  }

  if (pipeKind === '') {
    return null;
  }

  if (rootKinds.length === 0) {
    rootKinds.push('c');
  }

  for (k=0 ; k<rootKinds.length ; k++) {
    if (!stranglerSprites[pipeKind + '-from-' + rootKinds[k]]) {
      console.log(pipeKind + '-from-' + rootKinds[k], j, i);
    }
    game.ctx.drawImage(stranglerSprites[pipeKind + '-from-' + rootKinds[k]], (j - viewport.origin.x) * 20, (i - viewport.origin.y) * 20);
  }
}

var stranglerSprites = {};
var strangler;
strangler = new Image (); strangler.src = 'tiles/stranglers/a-from-b.png'; stranglerSprites['a-from-b'] = strangler;
strangler = new Image (); strangler.src = 'tiles/stranglers/a-from-c.png'; stranglerSprites['a-from-c'] = strangler;
strangler = new Image (); strangler.src = 'tiles/stranglers/a-from-d.png'; stranglerSprites['a-from-d'] = strangler;
strangler = new Image (); strangler.src = 'tiles/stranglers/ab-from-c.png'; stranglerSprites['ab-from-c'] = strangler;
strangler = new Image (); strangler.src = 'tiles/stranglers/ab-from-d.png'; stranglerSprites['ab-from-d'] = strangler;
strangler = new Image (); strangler.src = 'tiles/stranglers/abc-from-d.png'; stranglerSprites['abc-from-d'] = strangler;
strangler = new Image (); strangler.src = 'tiles/stranglers/abd-from-c.png'; stranglerSprites['abd-from-c'] = strangler;
strangler = new Image (); strangler.src = 'tiles/stranglers/ac-from-b.png'; stranglerSprites['ac-from-b'] = strangler;
strangler = new Image (); strangler.src = 'tiles/stranglers/ac-from-d.png'; stranglerSprites['ac-from-d'] = strangler;
strangler = new Image (); strangler.src = 'tiles/stranglers/acd-from-b.png'; stranglerSprites['acd-from-b'] = strangler;
strangler = new Image (); strangler.src = 'tiles/stranglers/ad-from-b.png'; stranglerSprites['ad-from-b'] = strangler;
strangler = new Image (); strangler.src = 'tiles/stranglers/ad-from-c.png'; stranglerSprites['ad-from-c'] = strangler;
strangler = new Image (); strangler.src = 'tiles/stranglers/b-from-a.png'; stranglerSprites['b-from-a'] = strangler;
strangler = new Image (); strangler.src = 'tiles/stranglers/b-from-c.png'; stranglerSprites['b-from-c'] = strangler;
strangler = new Image (); strangler.src = 'tiles/stranglers/b-from-d.png'; stranglerSprites['b-from-d'] = strangler;
strangler = new Image (); strangler.src = 'tiles/stranglers/bc-from-a.png'; stranglerSprites['bc-from-a'] = strangler;
strangler = new Image (); strangler.src = 'tiles/stranglers/bc-from-d.png'; stranglerSprites['bc-from-d'] = strangler;
strangler = new Image (); strangler.src = 'tiles/stranglers/bcd-from-a.png'; stranglerSprites['bcd-from-a'] = strangler;
strangler = new Image (); strangler.src = 'tiles/stranglers/bd-from-a.png'; stranglerSprites['bd-from-a'] = strangler;
strangler = new Image (); strangler.src = 'tiles/stranglers/bd-from-c.png'; stranglerSprites['bd-from-c'] = strangler;
strangler = new Image (); strangler.src = 'tiles/stranglers/c-from-a.png'; stranglerSprites['c-from-a'] = strangler;
strangler = new Image (); strangler.src = 'tiles/stranglers/c-from-b.png'; stranglerSprites['c-from-b'] = strangler;
strangler = new Image (); strangler.src = 'tiles/stranglers/c-from-d.png'; stranglerSprites['c-from-d'] = strangler;
strangler = new Image (); strangler.src = 'tiles/stranglers/cd-from-a.png'; stranglerSprites['cd-from-a'] = strangler;
strangler = new Image (); strangler.src = 'tiles/stranglers/cd-from-b.png'; stranglerSprites['cd-from-b'] = strangler;
strangler = new Image (); strangler.src = 'tiles/stranglers/d-from-a.png'; stranglerSprites['d-from-a'] = strangler;
strangler = new Image (); strangler.src = 'tiles/stranglers/d-from-b.png'; stranglerSprites['d-from-b'] = strangler;
strangler = new Image (); strangler.src = 'tiles/stranglers/d-from-c.png'; stranglerSprites['d-from-c'] = strangler;
