// @flow
// ----- Imports ----- //
import type { Action } from './productPagePeriodFormActions';

export type State<P> = {
  period: P | null;
};

// ----- Reducer ----- //
function productPagePeriodFormReducerFor<P>(scope: string, period: P) {
  const initialState = { period };
  return function productPagePeriodFormReducer(
    state: State<P> = initialState,
    action: Action<P>,
  ): State<P> {
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
