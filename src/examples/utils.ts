import { of } from 'rxjs';
import {
  delay,
  map,
  tap,
} from 'rxjs/operators';

const counterService = (() => {
  const _state = {
    count: 0,
  };

  const getCount = () => of({ status: 200, data: { count: _state.count } }).pipe(delay(1500));

  const setCount = (count: number) => {
    console.log('Persist count on the server', count);

    return of(null).pipe(
      delay(2250),
      tap(() => {
        console.log('Write!', count);
        _state.count = count;
      }),
      map(() => ({ status: 204, data: { count: _state.count } }))
    );
  };

  return { getCount, setCount };
})();

const dec = (v: number) => v - 1;

const inc = (v: number) => v + 1;

export { counterService, dec, inc };