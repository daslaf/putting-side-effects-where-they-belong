import React from "react";

import "./App.css";
import Zero from './examples/Zero';
import First from './examples/First';
import Second from './examples/Second';
import Third from './examples/Third';

enum Examples {
  Zero,
  First,
  Second,
  Third,
}

function getExample(active: Examples) {
  switch (active) {
    case Examples.Zero:
      return <Zero />
    case Examples.First:
      return <First />
    case Examples.Second:
      return <Second />
    case Examples.Third:
      return <Third />
    default:
      return null;
  }
}

function App() {
  const [active, setActive] = React.useState<Examples>(Examples.Zero);

  return (
    <div className="card">
      <ol className="selection-group">
        <li>
          <button
            className={active === Examples.Zero ? 'active' : undefined}
            onClick={() => setActive(Examples.Zero)}
          >
            Example 0
          </button>
        </li>
        <li>
          <button
            className={active === Examples.First ? 'active' : undefined}
            onClick={() => setActive(Examples.First)}
          >
            Example 1
          </button>
        </li>
        <li>
          <button
            className={active === Examples.Second ? 'active' : undefined}
            onClick={() => setActive(Examples.Second)}
          >
            Example 2
          </button>
        </li>
        <li>
          <button
            className={active === Examples.Third ? 'active' : undefined}
            onClick={() => setActive(Examples.Third)}
          >
            Example 3
          </button>
        </li>
      </ol>
      <section>
        {getExample(active)}
      </section>
    </div>
  );
}

export default App;
