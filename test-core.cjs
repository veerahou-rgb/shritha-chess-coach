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
const context = vm.createContext({
  document: { querySelector: node, addEventListener() {} },
  localStorage: { getItem: key => memory.get(key) || null, setItem: (key, value) => memory.set(key, value) },
  scrollTo() {},
  setTimeout() {},
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
console.log('Core lesson checks passed');
