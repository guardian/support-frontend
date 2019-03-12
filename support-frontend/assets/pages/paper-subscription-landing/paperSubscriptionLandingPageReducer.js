// @flow

// ----- Imports ----- //

import { combineReducers } from 'redux';
import type { CommonState } from 'helpers/page/commonReducer';
import { ProductPagePlanFormReducerFor, type State as FormState } from 'components/productPage/productPagePlanForm/productPagePlanFormReducer';

import { type TabActions } from './paperSubscriptionLandingPageActions';
import type { PaperFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type { PaperProductOptions } from 'helpers/productPrice/productOptions';
import type { ProductPrices } from 'helpers/productPrice/productPrices';


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


// ----- Exports ----- //

export default (initialTab: PaperFulfilmentOptions, product: ?string) => {

  const initialProduct: ?PaperProductOptions =
    product === 'Everyday' ||
    product === 'Sixday' ||
    product === 'Weekend' ||
    product === 'Sunday' ? product : null;

  const { productPrices } = window.guardian;

  return combineReducers({
    productPrices: () => productPrices,
    plan: ProductPagePlanFormReducerFor<?PaperProductOptions>('Paper', initialProduct),
    tab: getTabsReducer(initialTab),
  });
};
