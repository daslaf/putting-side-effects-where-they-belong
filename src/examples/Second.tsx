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
}

type Effects = Effect<Actions.Decrement> | Effect<Actions.Increment>;

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

    const counter$ = merge(increment$, decrement$).pipe(
      withLatestFrom(count$),
      map(([mapper, initial]) => mapper(initial)),
      tap((count) => setCount(count)),
      switchMap((count) => counterService.setCount(count))
    );

    const subscription = counter$.subscribe((res) => {
      setCount(res.data.count);
    });

    return () => subscription.unsubscribe();
  }, [count$, dec$, inc$]);

  const isLoading = status === Status.Loading || status === Status.Pending;

  return (
    <div>
      <h1>Counter example with persistance</h1>

      <p>{isLoading ? "Loading" : `Count: ${count}`}</p>
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
