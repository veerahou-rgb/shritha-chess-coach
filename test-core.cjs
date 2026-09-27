const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const html = fs.readFileSync('index.html', 'utf8');
const js = html.split('<script>')[1].split('</script>')[0];
const nodes = new Map();
const node = selector => {
  if (!nodes.has(selector)) nodes.set(selector, { innerHTML: '', textContent: '', classList: { add() {} }, querySelector() { return null }, insertAdjacentHTML(_where, html) { this.guideHTML = html } });
  return nodes.get(selector);
};
const memory = new Map();
const timers = [];
const context = vm.createContext({
  document: { querySelector: node, addEventListener() {} },
  localStorage: { getItem: key => memory.get(key) || null, setItem: (key, value) => memory.set(key, value) },
  scrollTo() {},
  setTimeout(callback, delay) { timers.push({ callback, delay }); return timers.length; },
  clearTimeout() {},
  window: {},
  console,
});
vm.runInContext(js, context);
assert.equal(vm.runInContext("line('b2','b2')", context), false, 'rook stays put');
assert.equal(vm.runInContext("line('b2','b4')", context), false, 'rook cannot land on rock');
assert.equal(vm.runInContext("line('b2','b6')", context), false, 'rook cannot pass rock');
assert.equal(vm.runInContext("line('b2','f2')", context), true, 'rook straight path');
assert.equal(vm.runInContext("line('b2','c3')", context), false, 'rook diagonal rejection');
assert.equal(vm.runInContext("nextGuideStep('c3',['d2','a3'],(a,b)=>Math.abs(F.indexOf(a[0])-F.indexOf(b[0]))*Math.abs(+a[1]-+b[1])===2)", context).length, 2, 'knight Help finds a reachable intermediate square');
assert.equal(vm.runInContext("nextGuideStep('b2',['b6'],line)", context).length, 2, 'rook Help can route around the rock');
vm.runInContext('settings()', context);
assert.match(node('#app').innerHTML, /Coach voice/);
assert.match(node('#app').innerHTML, /Preview this voice/);
vm.runInContext("S.started=true;S.stars=4;quietCheck('rook');answerCheck('rook',true)", context);
assert.equal(vm.runInContext('S.checks?.rook', context), undefined, 'wrong understanding answer remains open');
assert.match(node('#c').textContent, /Try once more/);
vm.runInContext("answerCheck('rook',false)", context);
assert.equal(vm.runInContext('S.checks.rook', context), true);
assert.equal(vm.runInContext('S.stars', context), 4, 'help and checks do not remove stars');
vm.runInContext("recordLearning('rook','mistakes');recordLearning('rook','mistakes');recordLearning('rook','mistakes')", context);
assert.match(node('#c').textContent, /smaller step/);
vm.runInContext("S.started=true;S.world=1;L.rook={p:'b2',z:['b6','f2','f6'],h:[]};rook()", context);
assert.match(node('#app').innerHTML, /Watch first · Rocky/);
timers.at(-1).callback();
assert.match(node('#app').innerHTML, /Watch me roll/);
timers.at(-1).callback();
assert.match(node('#app').innerHTML, /Now you try/);
assert.equal(vm.runInContext('S.intros.rook', context), true);
vm.runInContext('rook()', context);
function tap(square) {
  const target = { dataset: { q: square }, closest: () => target, classList: { add() {} } };
  node('#b').onclick({ target });
}
vm.runInContext('S.world=0;S.boardStage=0;S.boardPops=[];world0()', context);
tap('a1');
assert.equal(vm.runInContext('S.boardPops.length', context), 0, 'wrong color does not advance');
for (const square of ['a8','c8','e8','a1','c1','e1']) tap(square);
assert.equal(vm.runInContext('S.boardStage', context), 2, 'color activities lead to coordinates');
tap('e5');
assert.equal(vm.runInContext('S.world', context), 0);
tap('e4');
assert.equal(vm.runInContext('S.world', context), 1);
vm.runInContext('rook()', context);
vm.runInContext('rookHelp()', context);
assert.match(node('#b').guideHTML, /<svg class="guide"/);
tap('b4');
assert.equal(vm.runInContext('L.rook.p', context), 'b2');
tap('f2'); tap('f6'); tap('b6');
assert.match(node('#app').innerHTML, /Can Rocky travel through a rock/);
assert.equal(vm.runInContext('S.rookDone', context), true);
vm.runInContext("answerCheck('rook',false);next()", context);
assert.match(node('#app').innerHTML, /Watch first · Piece friends/);
timers.at(-1).callback();timers.at(-1).callback();
assert.equal(vm.runInContext('S.intros.knight', context), true);
vm.runInContext('knight()', context);
vm.runInContext('knightHelp()', context);
assert.match(node('#b').guideHTML, /<svg class="guide"/);
assert.match(node('#app').innerHTML, /Jump in an L/);
for (const square of ['a3', 'b1', 'c3', 'b1', 'd2']) tap(square);
assert.match(node('#app').innerHTML, /Can Klip-Klop jump over a piece/);
vm.runInContext("answerCheck('knight',true)", context);
vm.runInContext('S.reviewDue.rook=Date.now()-1;next()', context);
assert.match(node('#app').innerHTML, /Rocky’s new road/);
const beforeReviewStars=vm.runInContext('S.stars', context);
const reviewTarget={dataset:{q:'h3'},closest(){return this},classList:{add(){}}};
node('#reviewSkillBoard').onclick({target:reviewTarget});
assert.equal(vm.runInContext('S.stars', context),beforeReviewStars,'quiet review does not remove rewards');
assert.ok(vm.runInContext('S.reviewDue.rook', context)>Date.now());
vm.runInContext('next()', context);
for (const [kind, path] of Object.entries({bishop:['e3','g5','h6'],queen:['d4','g4','h5'],king:['e2','f3','g4'],pawn:['e4','e5','e6','e7','e8']})) {
  if (kind !== 'bishop') vm.runInContext('next()', context);
  assert.match(node('#app').innerHTML, /Watch first · Piece friends/);
  timers.at(-1).callback();timers.at(-1).callback();
  assert.equal(vm.runInContext(`S.intros.${kind}`, context), true);
  vm.runInContext(`pieceAdventure('${kind}')`, context);
  assert.match(node('#app').innerHTML, new RegExp(({bishop:'Bea the Bishop',queen:'Queen’s roads',king:'King’s careful steps',pawn:'Pawn march'})[kind]));
  tap('a8');
  assert.equal(vm.runInContext(`L.${kind}.p`, context), vm.runInContext(`PIECES.${kind}.start`, context), kind+' rejects illegal move');
  for (const square of path) tap(square);
  assert.equal(vm.runInContext(`S.pieceDone.${kind}`, context), true);
}
vm.runInContext('S.combatDone={capture:true,escape:true,promotion:true};next()', context);
assert.match(node('#app').innerHTML, /Watch first · Penny Panda/);
timers.at(-1).callback();timers.at(-1).callback();
assert.equal(vm.runInContext('S.intros.penny', context), true);
vm.runInContext('penny()', context);
assert.match(node('#app').innerHTML, /Who protects the pawn/);
const earned = vm.runInContext('S.stars', context);
vm.runInContext("L.rook={p:'b2',z:['b6','f2','f6'],h:[]};rook()", context);
tap('f2');
assert.equal(vm.runInContext('S.stars', context), earned, 'replay cannot mint repeat stars');
vm.runInContext('L.rook.z=[];rook()', context);
assert.match(node('#app').innerHTML, /Collect Rocky’s track stars/);
assert.deepEqual(Array.from(vm.runInContext('L.rook.z', context)), ['b6','f2','f6'], 'completed route can be practiced again');
vm.runInContext('toy(true)', context);
function toyTap(square){const target={dataset:{q:square},closest(){return this}};node('#toy').onclick({target})}
toyTap('a2');toyTap('a2');
assert.equal(vm.runInContext('S.toy.a2', context), '♙', 'same-square tap keeps piece');
toyTap('a2');toyTap('a4');
assert.equal(vm.runInContext('S.toy.a4', context), '♙');
vm.runInContext('rewindToy()', context);
assert.equal(vm.runInContext('S.toy.a2', context), '♙', 'toy rewind restores position');
vm.runInContext("screen='play';G={turn(){throw Error('bot moved after pause')}};gameMode='challenge';timmy()", context);
vm.runInContext('parent()', context);
node('#hold').onpointerdown();
assert.equal(timers.at(-1).delay, 2000);
timers.at(-1).callback();
assert.match(node('#app').innerHTML, /Parent Dashboard/);
node('#hold').onpointerup();
console.log('Core lesson checks passed');
