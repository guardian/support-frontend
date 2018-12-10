// @flow

// ----- Imports ----- //

import { type PaperBillingPlan } from 'helpers/subscriptions';
import { ProductPagePlanFormActionsFor } from 'components/productPage/productPagePlanForm/productPagePlanFormActions';
import { type PaperDeliveryMethod } from 'helpers/subscriptions';
import { paperSubsUrl } from 'helpers/routes';
import { getPaperCheckout } from 'helpers/externalLinks';
import { sendTrackingEventsOnClick } from 'helpers/subscriptions';

import { type State } from './paperSubscriptionLandingPageReducer';

// ----- Types ----- //
export type TabActions = { type: 'SET_TAB', tab: PaperDeliveryMethod }


// ----- Action Creators ----- //

const { setPlan } = ProductPagePlanFormActionsFor<PaperBillingPlan>('Paper', 'Paper');
const setTab = (tab: PaperDeliveryMethod): TabActions => {
  sendTrackingEventsOnClick(`switch_tab_${tab}`, 'Paper', null)();
  window.history.replaceState({}, null, paperSubsUrl(tab === 'delivery'));
  return { type: 'SET_TAB', tab };
};

const redirectToCheckout = () =>
  (dispatch: Dispatch<{||}>, getState: () => State) => {
    /* this action does not dipatch anything at the moment */
    const state = getState();
    const { referrerAcquisitionData, abParticipations, optimizeExperiments } = state.common;
    const location = state.page.plan.plan ? getPaperCheckout(
      state.page.plan.plan,
      referrerAcquisitionData,
      abParticipations,
      optimizeExperiments,
    ) : null;

    if (location) {
      sendTrackingEventsOnClick('main_cta_click', 'Paper', null)();
      window.location.href = location;
    }
  };


// ----- Exports ----- //

export { setPlan, setTab, redirectToCheckout };
