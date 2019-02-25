// @flow
// ----- Imports ----- //
import type { Action } from './productPagePlanFormActions';

export type State<P> = {
  plan: P | null;
};

// ----- Reducer ----- //
function ProductPagePlanFormReducerFor<P>(scope: string, plan: P) {
  const initialState = { plan };
  return function ProductPagePlanFormReducer(
    state: State<P> = initialState,
    action: Action<P>,
  ): State<P> {
    if (action.scope !== scope) {
      return state;
    }
    switch (action.type) {
      case 'SET_PLAN':
        return { ...state, plan: action.plan };
      default:
        return state;
    }
  };
}
export { ProductPagePlanFormReducerFor };
