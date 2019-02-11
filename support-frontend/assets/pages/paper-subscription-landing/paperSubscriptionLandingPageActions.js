// @flow

// ----- Imports ----- //

import { type PaperBillingPlan } from 'helpers/subscriptions';
import { ProductPagePlanFormActionsFor } from 'components/productPage/productPagePlanForm/productPagePlanFormActions';
import { type PaperDeliveryMethod } from 'helpers/subscriptions';
import { paperSubsUrl } from 'helpers/routes';
import { getPaperCheckout } from 'helpers/externalLinks';
import { sendClickedEvent } from 'helpers/tracking/clickTracking';

import { type State } from './paperSubscriptionLandingPageReducer';

// ----- Types ----- //
export type TabActions = { type: 'SET_TAB', tab: PaperDeliveryMethod }


// ----- Action Creators ----- //

const { setPlan } = ProductPagePlanFormActionsFor<PaperBillingPlan>('Paper', 'Paper');
const setTab = (tab: PaperDeliveryMethod): TabActions => {
  sendClickedEvent(`paper_subscription_landing_page-switch_tab-${tab}`)();
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
      // this is annoying because we *know* state.page.plan.plan exists --------------v
      const clickContext = 'paperSubscriptionLandingPage-'.concat(state.page.plan.plan ? state.page.plan.plan : '');
      sendClickedEvent(clickContext.concat('-subscribe_now_cta'))();
      window.location.href = location;
    }
  };


// ----- Exports ----- //

export { setPlan, setTab, redirectToCheckout };
