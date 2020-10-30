import React from "react";
import { merge } from "rxjs";
import { map, mapTo, switchMap, tap, withLatestFrom } from "rxjs/operators";
import {
  Effect,
  useEffectDispatcher,
  useStreamedValue,
} from "@osman.cea/rx-effects";

import { counterService, dec, inc } from "./utils";

enum Actions {
  Decrement = "Decrement",
  Increment = "Increment",
  Set = "Set",
}

type Effects =
  | Effect<Actions.Decrement>
  | Effect<Actions.Increment>
  | Effect<Actions.Set, { count: number }>;

enum Status {
  Pending,
  Loading,
  Done,
  Failed,
}

const CounterExample = () => {
  // Model
  const [count, setCount] = React.useState<number>(0);
  const [status, setStatus] = React.useState<Status>(Status.Pending);
  const { dispatch, useCreateSource } = useEffectDispatcher<Effects>();

  // Sources
  const count$ = useStreamedValue(count);
  const set$ = useCreateSource(Actions.Set);
  const dec$ = useCreateSource(Actions.Decrement);
  const inc$ = useCreateSource(Actions.Increment);

  // On init
  React.useEffect(() => {
    setStatus(Status.Loading);

    const subscription = counterService.getCount().subscribe((res) => {
      setStatus(Status.Done);
      setCount(res.data.count);
    });

    return () => subscription.unsubscribe();
  }, []);

  // On change
  React.useEffect(() => {
    const increment$ = inc$.pipe(mapTo(inc));
    const decrement$ = dec$.pipe(mapTo(dec));
    const setValue$ = set$.pipe(map((event) => () => event.count));

    const counter$ = merge(increment$, decrement$, setValue$).pipe(
      withLatestFrom(count$),
      map(([mapper, initial]) => mapper(initial)),
      tap((count) => setCount(count)),
      switchMap((count) => counterService.setCount(count))
    );

    const subscription = counter$.subscribe((res) => {
      setCount(res.data.count);
    });

    return () => subscription.unsubscribe();
  }, [count$, dec$, inc$, set$]);

  const isLoading = status === Status.Loading || status === Status.Pending;

  return (
    <div>
      <h1>Counter example with persistance and input</h1>

      <div style={{ margin: "1rem 0" }}>
        {isLoading ? (
          <p style={{ margin: 0 }}>Loading</p>
        ) : (
          <label>
            Count:
            <input
              type="number"
              step="1"
              value={count}
              onChange={(e) =>
                dispatch.next({ type: Actions.Set, count: +e.target.value })
              }
            />
          </label>
        )}
      </div>

      <button
        onClick={() => dispatch.next({ type: Actions.Decrement })}
        disabled={isLoading}
      >
        Decrement
      </button>
      <button
        onClick={() => dispatch.next({ type: Actions.Increment })}
        disabled={isLoading}
      >
        Increment
      </button>
    </div>
  );
};

export default CounterExample;
