// @flow
import { sendTrackingEventsOnClick, type SubscriptionProduct } from 'helpers/subscriptions';

export type Action<P> = { type: 'SET_PERIOD', period: P, scope: string };

function productPagePeriodFormActionsFor<P>(scope: string, product: SubscriptionProduct | null) {
  function setPeriod(period: string): (dispatch: Function) => Action<P> {
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
