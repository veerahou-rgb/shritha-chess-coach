const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const html = fs.readFileSync('index.html', 'utf8');
const js = html.split('<script>')[1].split('</script>')[0];
const nodes = new Map();
const node = selector => {
  if (!nodes.has(selector)) nodes.set(selector, { innerHTML: '', textContent: '', classList: { add() {} } });
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
vm.runInContext("S.started=true;S.stars=4;quietCheck('rook');answerCheck('rook',true)", context);
assert.equal(vm.runInContext('S.checks?.rook', context), undefined, 'wrong understanding answer remains open');
assert.match(node('#c').textContent, /Try once more/);
vm.runInContext("answerCheck('rook',false)", context);
assert.equal(vm.runInContext('S.checks.rook', context), true);
assert.equal(vm.runInContext('S.stars', context), 4, 'help and checks do not remove stars');
vm.runInContext("recordLearning('rook','mistakes');recordLearning('rook','mistakes');recordLearning('rook','mistakes')", context);
assert.match(node('#c').textContent, /smaller step/);
vm.runInContext("S.started=true;S.world=1;L.rook={p:'b2',z:['b6','f2','f6'],h:[]};rook()", context);
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
tap('b4');
assert.equal(vm.runInContext('L.rook.p', context), 'b2');
tap('f2'); tap('f6'); tap('b6');
assert.match(node('#app').innerHTML, /Can Rocky travel through a rock/);
assert.equal(vm.runInContext('S.rookDone', context), true);
vm.runInContext("answerCheck('rook',false);next()", context);
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
assert.match(node('#app').innerHTML, /Bea the Bishop/);
for (const [kind, path] of Object.entries({bishop:['e3','g5','h6'],queen:['d4','g4','h5'],king:['e2','f3','g4'],pawn:['e4','e5','e6','e7','e8']})) {
  if (kind !== 'bishop') vm.runInContext('next()', context);
  assert.match(node('#app').innerHTML, new RegExp(({bishop:'Bea the Bishop',queen:'Queen’s roads',king:'King’s careful steps',pawn:'Pawn march'})[kind]));
  tap('a8');
  assert.equal(vm.runInContext(`L.${kind}.p`, context), vm.runInContext(`PIECES.${kind}.start`, context), kind+' rejects illegal move');
  for (const square of path) tap(square);
  assert.equal(vm.runInContext(`S.pieceDone.${kind}`, context), true);
}
vm.runInContext('S.combatDone={capture:true,escape:true,promotion:true};next()', context);
assert.match(node('#app').innerHTML, /Who protects the pawn/);
const earned = vm.runInContext('S.stars', context);
vm.runInContext("L.rook={p:'b2',z:['b6','f2','f6'],h:[]};rook()", context);
tap('f2');
assert.equal(vm.runInContext('S.stars', context), earned, 'replay cannot mint repeat stars');
vm.runInContext('parent()', context);
node('#hold').onpointerdown();
assert.equal(timers.at(-1).delay, 2000);
timers.at(-1).callback();
assert.match(node('#app').innerHTML, /Parent Dashboard/);
node('#hold').onpointerup();
console.log('Core lesson checks passed');
