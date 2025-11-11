const { useState } = React;

const Button = ({ text, color }) => {
  const [count, setCount] = useState(0);
  const handleClick = () => setCount(count + 1);
  return (
    <button
      onClick={handleClick}
      className="btn"
      style={{ backgroundColor: color || 'steelblue' }}
    >
      {text || 'Click Me'} — Clicked {count} times
    </button>
  );
};


