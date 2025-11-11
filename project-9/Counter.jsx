const { useState } = React;

const Counter = () => {
  const [count, setCount] = useState(0);
  return (
    <section className="card">
      <h2>Counter (State + Composition)</h2>
      <Display count={count} />
      <div className="row">
        <button className="btn ghost" onClick={() => setCount(count - 1)}>-</button>
        <button className="btn ghost" onClick={() => setCount(count + 1)}>+</button>
        <button className="btn ghost" onClick={() => setCount(0)}>Reset</button>
      </div>
    </section>
  );
};


