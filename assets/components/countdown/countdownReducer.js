// @flow

// ----- Imports ----- //
import type { Action } from './countdownActions';

// ----- Reducer ----- //
function countdownReducerFor(scope: string, endTime: number) {

  const calculateRemainingTime = (): number => endTime - Date.now();

  return function countdownReducer(
    state: number = calculateRemainingTime(),
    action: Action,
  ) {

    if (action.scope !== scope) {
      return state;
    }

    switch (action.type) {
      case 'TICK_COUNTDOWN':
        return calculateRemainingTime();
      default:
        return state;
    }
  };
}


export { countdownReducerFor };
