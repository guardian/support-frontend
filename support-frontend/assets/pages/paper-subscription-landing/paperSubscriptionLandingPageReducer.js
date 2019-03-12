// @flow

// ----- Imports ----- //

import { combineReducers } from 'redux';
import type { CommonState } from 'helpers/page/commonReducer';
import { ProductPagePlanFormReducerFor, type State as FormState } from 'components/productPage/productPagePlanForm/productPagePlanFormReducer';

import { type TabActions } from './paperSubscriptionLandingPageActions';
import type { PaperFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type { PaperProductOptions } from 'helpers/productPrice/productOptions';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { ActivePaperProductTypes } from 'helpers/productPrice/productOptions';


// ----- Types ----- //

export type ActiveTabState = PaperFulfilmentOptions;

export type State = {
  common: CommonState,
  page: {
    productPrices: ProductPrices,
    tab: ActiveTabState,
    plan: FormState<PaperProductOptions>,
  }
};


// ----- Helpers ----- //

const getTabsReducer = (initialTab: PaperFulfilmentOptions) =>
  (state: ActiveTabState = initialTab, action: TabActions): ActiveTabState => {

    switch (action.type) {
      case 'SET_TAB':
        return action.tab;
      default:
        return state;
    }

  };

const findInitialProduct = (product: ?string) => {
  if (!product) { return null; }
  // $FlowIgnore - Flow doesn't realise we've already checked product is not null
  const index = ActivePaperProductTypes.findIndex(s => s.toLowerCase() === product.toLowerCase());
  return index > -1 ? ActivePaperProductTypes[index] : null;
};

// ----- Exports ----- //

export default (initialTab: PaperFulfilmentOptions, product: ?string) => {

  const { productPrices } = window.guardian;

  return combineReducers({
    productPrices: () => productPrices,
    plan: ProductPagePlanFormReducerFor<?PaperProductOptions>('Paper', findInitialProduct(product)),
    tab: getTabsReducer(initialTab),
  });
};
