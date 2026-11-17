import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
const results = [];
const order = [];
order.push('A');
const timer = new Promise(resolve => setTimeout(() => { order.push('B'); resolve(); }, 0));
Promise.resolve().then(() => order.push('C'));
order.push('D');
await timer;
assert.deepEqual(order, ['A', 'D', 'C', 'B']);
results.push({check:'event loop', output:order});
function edit(x) { x.score = 90; x = {score:0}; }
const student = {score:50}; edit(student); assert.equal(student.score,90);
assert.equal([] == false,true); assert.equal(null == undefined,true);
assert.equal(NaN === NaN,false); assert.equal(Number.isNaN(NaN),true);
assert.equal(0 || 50,50); assert.equal(0 ?? 50,0);
const products=[{active:true,price:100,quantity:2},{active:false,price:400,quantity:1},{active:true,price:50,quantity:3}];
const total=products.filter(p=>p.active).reduce((sum,p)=>sum+p.price*p.quantity,0);
assert.equal(total,350); results.push({check:'active product total',output:total});
const triggers = [
 ['SyntaxError',()=>new Function('let = ;')],
 ['ReferenceError',()=>missingVariable],
 ['TypeError',()=>null.value],
 ['RangeError',()=>new Array(-1)],
 ['URIError',()=>decodeURIComponent('%')]
];
for (const [name,run] of triggers) assert.throws(run,{name});
function finallyWins(){try{return 'try value';}finally{return 'finally value';}}
assert.equal(finallyWins(),'finally value');
const events=new EventEmitter();const baseline=events.listenerCount('message');
function attach(){const handler=()=>{};events.on('message',handler);return()=>events.off('message',handler);}
for(let i=0;i<200;i++){const detach=attach();detach();}
assert.equal(events.listenerCount('message'),baseline);
results.push({check:'five error categories, value semantics, equality, defaults, finally and listener cleanup',output:'PASS'});
console.log(JSON.stringify({status:'PASS',results},null,2));
