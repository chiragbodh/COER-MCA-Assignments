import React, { useState } from 'react';
export default function App() {
  const [count, setCount] = useState(0);
  return <main><p>MEAN STACK / ASSIGNMENT 02</p><h1>COER MCA - React practice</h1>
    <p>Component state updates the displayed count.</p>
    <h2 aria-live="polite">Completed exercises: {count}</h2>
    <button onClick={() => setCount(value => value + 1)}>Complete one exercise</button>{' '}
    <button onClick={() => setCount(0)}>Reset</button></main>;
}
