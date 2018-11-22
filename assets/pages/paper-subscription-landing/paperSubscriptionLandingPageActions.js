// @flow

// ----- Imports ----- //

import { type PaperBillingPlan } from 'helpers/subscriptions';
import { ProductPagePlanFormActionsFor } from 'components/productPage/productPagePlanForm/productPagePlanFormActions';
import { type Tab } from './components/tabs';

// ----- Types ----- //
export type TabActions = { type: 'SET_TAB', tab: Tab }


// ----- Action Creators ----- //

const { setPlan } = ProductPagePlanFormActionsFor<PaperBillingPlan>('Paper', 'Paper');
const setTab = (tab: Tab): TabActions => ({ type: 'SET_TAB', tab });

// ----- Exports ----- //

export { setPlan, setTab };
