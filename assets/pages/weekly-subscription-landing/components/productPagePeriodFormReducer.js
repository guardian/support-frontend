// @flow
// ----- Imports ----- //
import type { Action } from './productPagePeriodFormActions';

type State = {
  period: string | null;
};

// ----- Reducer ----- //
function productPagePeriodFormReducerFor(scope: string, initialState: State) {
  return function productPagePeriodFormReducer(
    state: State = initialState,
    action: Action,
  ): State {
    if (action.scope !== scope) {
      return state;
    }
    switch (action.type) {
      case 'SET_PERIOD':
        return { ...state, period: action.period };
      default:
        return state;
    }
  };
}
export { productPagePeriodFormReducerFor };
