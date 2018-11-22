// @flow

// ----- Imports ----- //

import { type PaperBillingPlan } from 'helpers/subscriptions';
import { ProductPagePlanFormActionsFor } from 'components/productPage/productPagePlanForm/productPagePlanFormActions';
import { type PaperDeliveryMethod } from 'helpers/subscriptions';
import { paperSubsUrl } from 'helpers/routes';

// ----- Types ----- //
export type TabActions = { type: 'SET_TAB', tab: PaperDeliveryMethod }


// ----- Action Creators ----- //

const { setPlan } = ProductPagePlanFormActionsFor<PaperBillingPlan>('Paper', 'Paper');
const setTab = (tab: PaperDeliveryMethod): TabActions => {
  window.history.replaceState({}, null, paperSubsUrl(tab));
  return { type: 'SET_TAB', tab };
};

// ----- Exports ----- //

export { setPlan, setTab };
