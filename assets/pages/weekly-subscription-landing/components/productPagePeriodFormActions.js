// @flow
import { sendTrackingEventsOnClick, type SubscriptionProduct } from 'helpers/subscriptions';

export type Action = { type: 'SET_PERIOD', period: string, scope: string };

function productPagePeriodFormActionsFor(scope: string, product: SubscriptionProduct | null) {
  function setPeriod(period: string): (dispatch: Function) => Action {
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
