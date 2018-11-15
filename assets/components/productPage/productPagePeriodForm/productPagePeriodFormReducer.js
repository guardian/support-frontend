// @flow
// ----- Imports ----- //
import type { Action } from './productPagePeriodFormActions';

export type State<Period> = {
  period: Period | null;
};

// ----- Reducer ----- //
function productPagePeriodFormReducerFor<Period>(scope: string, initialState: State<Period>) {
  return function productPagePeriodFormReducer(
    state: State<Period> = initialState,
    action: Action<Period>,
  ): State<Period> {
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
