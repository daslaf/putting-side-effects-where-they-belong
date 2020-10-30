import React from "react";
import { BehaviorSubject, Subject, merge } from "rxjs";
import { filter, map, mapTo, withLatestFrom } from "rxjs/operators";

import { dec, inc } from "./utils";

enum Actions {
  Decrement = "Decrement",
  Increment = "Increment",
}

const CounterExample = () => {
  const [count, setCount] = React.useState(0);
  const [dispatch] = React.useState(() => new Subject<{ type: Actions }>());
  const [count$] = React.useState(() => new BehaviorSubject(count));

  React.useEffect(() => {
    count$.next(count);
  }, [count$, count]);

  React.useEffect(() => {
    const increment$ = dispatch.pipe(
      filter(event => event.type === Actions.Increment),
      mapTo(inc)
    );
    const decrement$ = dispatch.pipe(
      filter(event => event.type === Actions.Decrement),
      mapTo(dec)
    );

    const counter$ = merge(increment$, decrement$).pipe(
      withLatestFrom(count$),
      map(([mapper, initial]) => mapper(initial))
    );
    const subscription = counter$.subscribe((value) => setCount(value));

    return () => subscription.unsubscribe();
  }, [count$, dispatch]);

  return (
    <div>
      <h1>Counter example</h1>

      <p>Count: {count}</p>
      <button onClick={() => dispatch.next({ type: Actions.Decrement })}>
        Decrement
      </button>
      <button onClick={() => dispatch.next({ type: Actions.Increment })}>
        Increment
      </button>
    </div>
  );
};

export default CounterExample;
