# AIML Assignment 3 — JavaScript and AI debugging

Source: `MCWD201T-AS03 (1).docx`, Unit III. [Original questions](QUESTIONS.md). Run the executable examples with `node examples.mjs`; the program checks its expected results and exits unsuccessfully if an assertion fails. Browser event examples are in [the practical demo](../Lab-Sheet-01/).

## Q1(a) Runtime and event loop

JavaScript executes a function on the call stack until it returns or throws. Calling another function adds a frame; returning removes it. Browser facilities handle timers, network activity and DOM events outside the ordinary synchronous stack. When eligible, callbacks are scheduled for later processing. Promise reactions use the microtask queue; timer callbacks are tasks, often informally called macrotasks.

After the current task finishes and the stack becomes empty, the browser drains pending microtasks before moving to another task and an appropriate rendering opportunity. A zero-delay timeout is therefore not immediate. An endless chain of microtasks can delay timers and rendering. Node.js has additional event-loop phases and queues, so do not apply every browser detail to every Node scheduling case. [MDN execution model](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model).

## Q1(b) Exact output order

The question gives no concrete snippet, so use this explicit example:

```js
console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
console.log('D');
```

Output is `A`, `D`, `C`, `B`. The initial script logs A, schedules a timer, registers a Promise reaction and logs D. After the synchronous work finishes, the Promise microtask logs C. The timer task later logs B. A timer delay is a minimum eligibility delay, not an exact execution deadline. The order is verified in `examples.mjs` for this example; changing the code to include nested queues can change the result.

## Q2(a) Values, objects and parameter passing

Primitives include string, number, bigint, boolean, undefined, symbol and null. They are immutable values. Objects, arrays and functions have identity and can contain mutable properties. Engines often use a stack for call frames and heap allocation for objects, but the language specification does not require the simplistic rule “all primitives on stack, all objects on heap.” Optimizations may change storage.

JavaScript passes arguments by value. For an object, the copied value is a reference to the same object: mutating a property is visible to the caller, while reassigning the parameter is not.

```js
function edit(x) { x.score = 90; x = { score: 0 }; }
const student = { score: 50 };
edit(student); // student.score is 90, not 0
```

This is often called pass-by-sharing; it is not true pass-by-reference that allows replacing the caller's variable binding.

## Q2(b) var, let and const

| Declaration | Scope | Before initialization | Reassignment |
|---|---|---|---|
| `var` | Function or global/script scope | Binding exists with `undefined` | Allowed |
| `let` | Block | Temporal Dead Zone; access throws | Allowed |
| `const` | Block | Temporal Dead Zone; access throws | Disallowed |

```js
console.log(v); // undefined
var v = 1;
{ let local = 2; }
// console.log(local); // ReferenceError
const options = { enabled: true };
options.enabled = false; // valid: binding unchanged
// options = {}; // TypeError
```

All declarations are processed before execution in different ways. Saying `let` is “not hoisted” hides the TDZ behavior. A `const` object is not deeply immutable; use suitable copying or freezing where necessary. Prefer `const` by default and `let` when a binding must change.

## Q3(a) Equality and coercion

Strict equality `===` compares without the loose-equality conversion rules. Loose equality `==` may convert operands according to type-specific rules. `[] == false` is true: false becomes 0, the array becomes an empty string through primitive conversion, and that string becomes 0. `null == undefined` is a special loose-equality match; it does not mean both equal zero. `NaN === NaN` is false; use `Number.isNaN(value)` to test for numeric NaN.

Objects compare by identity: two separately created `{}` objects are not strictly equal even if their properties match. Prefer strict equality for predictable comparisons, and use explicit conversion when input should be numeric. Do not assume `==` always converts both sides to numbers; the rules depend on operand types.

## Q3(b) Conditionals and defaults

Use `if/else` for ranges or compound conditions, `switch` for selecting among discrete cases, and a ternary for a short expression that chooses between two values. Include `break` in a switch unless fall-through is intentional. `||` returns its right operand when the left is falsy; `??` does so only for null or undefined.

```js
const requestedVolume = 0;
console.log(requestedVolume || 50); // 50: overwrites a valid mute setting
console.log(requestedVolume ?? 50); // 0: preserves the user's choice
```

Other falsy values include false, empty string and NaN. Choose the operator according to the data contract. Parenthesize when combining `??` with `&&` or `||`, because unparenthesized mixing is a syntax error.

## Q4(a) Choosing a loop

`for` is useful when an index, initialization and update are explicit. `while` continues while a condition remains true, useful when the iteration count is unknown. `for...in` enumerates enumerable string property keys, including inherited enumerable properties. It is therefore usually a poor array-value loop: custom properties can appear and keys are strings.

`for...of` obtains values from an object's iterator, so it works with arrays, strings, sets and other iterables. Plain objects are not automatically iterable; use `Object.entries()` for their own key/value pairs. Use an indexed loop when you need positions, and `for...of` when you need values. Avoid confusing enumeration of object properties with iteration over a collection's values.

## Q4(b) Array transformations

`map` creates one transformed result per visited element; `filter` keeps elements satisfying a predicate; `reduce` accumulates a result; `forEach` performs side effects and returns undefined. These methods do not inherently deep-copy objects.

```js
const products = [
  { active: true, price: 100, quantity: 2 },
  { active: false, price: 400, quantity: 1 },
  { active: true, price: 50, quantity: 3 }
];
const total = products.filter(p => p.active)
  .reduce((sum, p) => sum + p.price * p.quantity, 0);
console.log(total); // 350
```

The initial accumulator 0 makes an empty filtered array return zero rather than throwing. For real financial calculations, use integer minor units or an appropriate decimal representation rather than assuming all decimal fractions are exact binary floats.

## Q5(a) Parameters and arguments

Default parameters provide a value when an argument is omitted or explicitly undefined: `function greet(name = 'Student')`. Passing null does not activate that default. Rest syntax collects remaining arguments into a real array: `function sum(...values) { return values.reduce((a,b) => a+b, 0); }`. A rest parameter must be last.

Traditional non-arrow functions also have an `arguments` object. It is array-like, not an ordinary array, and its behavior has historical differences between strict and non-strict code. Arrow functions have no own `arguments`; they capture it from an outer scope if one exists. Prefer named parameters and rest arrays for clarity. Validate inputs when a function's contract requires numbers rather than accepting accidental string concatenation.

## Q5(b) Arrow versus traditional functions

An ordinary function's `this` depends on how it is called: as a method, via `call`, as a constructor or otherwise. An arrow captures `this` lexically from its surrounding scope and cannot be used as a constructor. This makes arrows convenient for callbacks that should retain the surrounding instance.

```js
class Counter {
  value = 0;
  start() {
    setTimeout(() => { this.value += 1; }, 0);
  }
}
```

The callback refers to the Counter instance. A standalone ordinary callback would not automatically retain that receiver. Conversely, an arrow is a poor choice for an object method that needs dynamic `this`. Arrow syntax is not simply a shorter interchangeable spelling of every function.

## Q6(a) DOM propagation phases

During capturing, an event travels through ancestors toward the target; listeners registered with `{capture: true}` participate. At the target, target listeners run. During bubbling, a bubbling event travels back through ancestors. `event.target` identifies the originating target; `event.currentTarget` is the element whose listener is currently running.

`stopPropagation()` stops propagation to further nodes, but does not cancel the default action and does not stop other listeners already associated with the same node. Use `preventDefault()` to cancel a cancelable default action, and `stopImmediatePropagation()` when it is appropriate to stop remaining same-node listeners too. Not every event bubbles. Prefer predictable event flow and avoid unnecessary propagation blocking that breaks delegated controls.

## Q6(b) Event delegation

```js
const list = document.querySelector('#courses');
list.addEventListener('click', event => {
  if (!(event.target instanceof Element)) return;
  const button = event.target.closest('button[data-course]');
  if (!button || !list.contains(button)) return;
  document.querySelector('#selection').textContent =
    `Selected ${button.dataset.course}`;
});
```

Place a real button inside each list item. One parent listener handles existing and newly added buttons through bubbling. `closest` also handles a click on an icon inside the button, while `contains` keeps matching within the intended list. A button gives keyboard activation automatically, unlike a clickable plain `li`. Setting `textContent` avoids interpreting the selected text as HTML.

## Q7(a) Comment-to-code development

A developer writes an intent comment near the intended implementation; an assistant uses the comment and surrounding code to propose code. A useful comment describes the input contract, output, edge cases and constraints, rather than merely repeating a function name. For example: “Return active products sorted by price without mutating the input; preserve input order for equal prices.”

Comment quality matters because an ambiguous instruction invites assumptions. The generated implementation must still be reviewed and tested, and the comment must remain consistent after edits. Comments do not execute, so a correct-looking comment can conceal incorrect code. Use them to communicate intent, then verify observable behavior with representative and boundary inputs.

## Q7(b) JSDoc for fetchUserData

```js
/**
 * Fetch a user from this application's same-origin API.
 * @param {number} userId Positive integer user identifier.
 * @param {AbortSignal} [signal] Optional cancellation signal.
 * @returns {Promise<{id:number, name:string}>} Validated user data.
 * @throws {TypeError} If the identifier or response structure is invalid.
 * @throws {Error} If HTTP status is unsuccessful; network/abort errors propagate.
 */
async function fetchUserData(userId, signal) {
  if (!Number.isSafeInteger(userId) || userId <= 0) throw new TypeError('Invalid ID');
  const response = await fetch(`/api/users/${userId}`, { signal });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const user = await response.json();
  if (user?.id !== userId || typeof user.name !== 'string')
    throw new TypeError('Invalid user response');
  return { id: user.id, name: user.name };
}
```

For an async function, these failures reject the returned Promise. JSDoc helps editors and assistants understand the contract; it does not enforce runtime types by itself.

## Q8(a) Error categories

| Error | Meaning | Isolated example |
|---|---|---|
| SyntaxError | Source cannot be parsed | `new Function('let = ;')` |
| ReferenceError | Missing or inaccessible binding | `missingVariable` |
| TypeError | Operation invalid for the value | `null.value` |
| RangeError | Value outside an operation's accepted range | `new Array(-1)` |
| URIError | Malformed URI encoding | `decodeURIComponent('%')` |

The executable examples catch each error separately so one failure does not stop all demonstrations. A syntax error in the same script normally prevents that script from starting; the `Function` example deliberately parses a string at runtime to make the demonstration catchable. Error names narrow the investigation but the stack trace and failing values are needed to find the cause.

## Q8(b) try, catch and finally

`try` contains code that may fail. `catch` handles a thrown exception. `finally` runs when control leaves the construct, including most returns and throws, and is suitable for cleanup. An `await` must be inside the try if its rejection should be caught there.

```js
function result() {
  try { return 'try value'; }
  finally { return 'finally value'; }
}
console.log(result()); // finally value
```

A return or throw in finally replaces an earlier completion, potentially hiding an error or intended return. Avoid that pattern; release resources in finally and return outside it. Process termination or a machine crash is not an occasion on which cleanup is guaranteed to run.

## Q9(a) Debugging rejected Promises with AI

Reproduce the failure with a small input and capture the error name, stack, failing line, runtime/library versions and expected behavior. Include the relevant async function, caller and error-handling path, with secrets and personal data removed. State whether a Promise is awaited, returned, deliberately detached or used inside an event listener.

Ask for a diagnosis, minimal correction and a regression test covering both success and failure. Common issues include missing await, errors outside the try block, `forEach(async ...)` not being awaited and a missing return in a Promise chain. Do not merely suppress unhandled-rejection warnings. After applying the fix, execute the reproduction and confirm cleanup and user-facing failure behavior as well as the successful path.

## Q9(b) Memory-leak diagnosis prompt

```text
Investigate a possible listener leak in this Node.js service. Preserve
business behavior and public API. Runtime: [exact version]. Reproduction:
connect and disconnect a client 200 times; listenerCount('message') grows.
Representative diagnostic trace:
MaxListenersExceededWarning: Possible EventEmitter memory leak detected
    at Socket.addListener (node:events:...)
    at attachClient (src/clients.js:42:11)
Relevant attach/detach functions and test are attached below: [code].
Find the unmatched registration/cleanup path. Check listener identity,
error exits and reconnects. Suggest a minimal patch and a regression test
showing listener counts return to baseline. Do not just increase
setMaxListeners. Distinguish a warning from proof of retained memory;
explain what heap evidence would confirm the leak.
```

The trace is illustrative, not a log from this repository.

## Q10(a) Plausible but logically wrong code

A model can predict a syntactically familiar pattern without knowing the actual execution state or full contract. Missing context, stale API knowledge and ambiguous requirements can produce errors such as forgetting await, racing two updates or ignoring a rejected Promise. Syntax checking will not catch every such mistake.

For example, `if (checkPermission())` incorrectly treats a Promise as truthy when the intended condition is `if (await checkPermission())`. The code parses successfully but may allow an operation regardless of the eventual result. Use precise types, lint rules for floating/misused Promises, realistic tests and runtime observations. Review security-sensitive decisions especially carefully, rather than trusting the fluency of an explanation.

## Q10(b) AI debugging versus DevTools

AI is useful for proposing hypotheses, explaining unfamiliar errors and drafting focused tests. Browser DevTools exposes actual execution: breakpoints show which branch runs, scope inspection reveals values, call stacks show callers and DOM tools show current structure and computed styles. AI cannot replace that evidence by guessing.

For a complex DOM-state bug, reproduce the problem, pause at the event/state transition and inspect the real state first. Give the assistant a concise account of those observations to help reason about a fix. Apply a minimal change and replay the sequence, including rapid clicks and failed requests. The strongest approach combines live evidence with explanation; an AI-only rewrite is usually less reliable than a measured diagnosis.
