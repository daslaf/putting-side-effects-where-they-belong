import React from "react";
import { merge } from "rxjs";
import { map, mapTo, withLatestFrom } from "rxjs/operators";
import {
  Effect,
  useEffectDispatcher,
  useStreamedValue,
} from "@osman.cea/rx-effects";

import { dec, inc } from "./utils";

enum Actions {
  Decrement = "Decrement",
  Increment = "Increment",
}

type Effects = Effect<Actions.Decrement> | Effect<Actions.Increment>;


const CounterExample = () => {
  // Model
  const [count, setCount] = React.useState(0);
  const { dispatch, useCreateSource } = useEffectDispatcher<Effects>();

  // Sources
  const count$ = useStreamedValue(count);
  
  const dec$ = useCreateSource(Actions.Decrement);
  const inc$ = useCreateSource(Actions.Increment);

  React.useEffect(() => {
    const increment$ = inc$.pipe(mapTo(inc));
    const decrement$ = dec$.pipe(mapTo(dec));

    const counter$ = merge(increment$, decrement$).pipe(
      withLatestFrom(count$),
      map(([mapper, initial]) => mapper(initial))
    );
    const subscription = counter$.subscribe((value) => setCount(value));

    return () => subscription.unsubscribe();
  }, [count$, dec$, inc$]);

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
