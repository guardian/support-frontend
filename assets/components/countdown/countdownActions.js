// @flow
import type { Dispatch } from 'redux';

export type Action = { type: 'TICK_COUNTDOWN', scope: string };

function countdownActionsFor(scope: string) {
  function tick() {
    return (dispatch: Dispatch<any>) => {
      setTimeout(() => {
        dispatch({ type: 'TICK_COUNTDOWN', scope });
        dispatch(tick());
      }, 1000);
    };
  }
  return { tick };
}

export { countdownActionsFor };
