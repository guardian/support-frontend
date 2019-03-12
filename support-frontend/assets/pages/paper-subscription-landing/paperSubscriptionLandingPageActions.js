// @flow

// ----- Imports ----- //

import { type PaperBillingPlan } from 'helpers/subscriptions';
import { ProductPagePlanFormActionsFor } from 'components/productPage/productPagePlanForm/productPagePlanFormActions';
import { paperCheckoutUrl, paperSubsUrl } from 'helpers/routes';
import { getPaperCheckout } from 'helpers/externalLinks';
import { sendClickedEvent } from 'helpers/tracking/clickTracking';

import { type State } from './paperSubscriptionLandingPageReducer';
import type { PaperFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import { HomeDelivery } from 'helpers/productPrice/fulfilmentOptions';
import { Everyday } from 'helpers/productPrice/productOptions';
import { getQueryParameter } from 'helpers/url';

// ----- Types ----- //
export type TabActions = { type: 'SET_TAB', tab: PaperFulfilmentOptions }


// ----- Action Creators ----- //

const { setPlan } = ProductPagePlanFormActionsFor<PaperBillingPlan>('Paper', 'Paper');
const setTab = (tab: PaperFulfilmentOptions): TabActions => {
  sendClickedEvent(`paper_subscription_landing_page-switch_tab-${tab}`)();
  window.history.replaceState({}, null, paperSubsUrl(tab === 'delivery'));
  return { type: 'SET_TAB', tab };
};

const getCheckoutUrl = (state: State) => {
  if (getQueryParameter('displayCheckout') === 'true') {
    return paperCheckoutUrl(HomeDelivery, Everyday);
  }

  const { referrerAcquisitionData, abParticipations, optimizeExperiments } = state.common;
  return state.page.plan.plan ? getPaperCheckout(
    state.page.plan.plan,
    referrerAcquisitionData,
    abParticipations,
    optimizeExperiments,
  ) : null;
};

const redirectToCheckout = () =>
  (dispatch: Dispatch<{||}>, getState: () => State) => {
    /* this action does not dipatch anything at the moment */
    const state = getState();
    const location = getCheckoutUrl(state);

    if (location) {
      // this is annoying because we *know* state.page.plan.plan exists --------------v
      const clickContext = 'paperSubscriptionLandingPage-'.concat(state.page.plan.plan ? state.page.plan.plan : '');
      sendClickedEvent(clickContext.concat('-subscribe_now_cta'))();
      window.location.href = location;
    }
  };


// ----- Exports ----- //

export { setPlan, setTab, redirectToCheckout };
