// @flow
import { type Dispatch } from 'redux';
import { sendTrackingEventsOnClick, type SubscriptionProduct } from 'helpers/subscriptions';

export type Action<P> = { type: 'SET_PERIOD', period: P, scope: string };

function productPagePeriodFormActionsFor<P:string>(scope: string, product: SubscriptionProduct | null) {
  function setPeriod(period: P): (dispatch: Dispatch<Action<P>>) => Action<P> {
    return (dispatch) => {
      if (product) {
        sendTrackingEventsOnClick(`toggle_period_${period}`, product, null)();
      }
      return dispatch({ type: 'SET_PERIOD', period, scope });
    };
  }

  return { setPeriod };
}

export { productPagePeriodFormActionsFor };
