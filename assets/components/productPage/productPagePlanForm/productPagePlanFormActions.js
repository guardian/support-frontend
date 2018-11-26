// @flow
import { type Dispatch } from 'redux';
import { sendTrackingEventsOnClick, type SubscriptionProduct } from 'helpers/subscriptions';

export type Action<P> = { type: 'SET_PLAN', plan: P, scope: string };

function ProductPagePlanFormActionsFor<P:string>(scope: string, product: SubscriptionProduct | null) {
  function setPlan(plan: P): (dispatch: Dispatch<Action<P>>) => Action<P> {
    return (dispatch) => {
      if (product) {
        sendTrackingEventsOnClick(`toggle_plan_${plan}`, product, null)();
      }
      return dispatch({ type: 'SET_PLAN', plan, scope });
    };
  }

  return { setPlan };
}

export { ProductPagePlanFormActionsFor };
