// @flow

// ----- Imports ----- //

import { combineReducers } from 'redux';
import type { CommonState } from 'helpers/page/commonReducer';

import { type TabActions } from './paperSubscriptionLandingPageActions';
import { Collection, type PaperFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { paperHasDeliveryEnabled } from 'helpers/subscriptions';
import { getProductPrices } from 'helpers/globals';


// ----- Types ----- //

export type ActiveTabState = PaperFulfilmentOptions;

export type State = {
  common: CommonState,
  page: {
    productPrices: ProductPrices,
    tab: ActiveTabState,
  }
};


// ----- Helpers ----- //

const getTabsReducer = (initialTab: PaperFulfilmentOptions) =>
  (state: ActiveTabState = initialTab, action: TabActions): ActiveTabState => {

    switch (action.type) {
      case 'SET_TAB':
        return paperHasDeliveryEnabled() ? action.tab : Collection;
      default:
        return state;
    }

  };

// ----- Exports ----- //

export default (initialTab: PaperFulfilmentOptions) => combineReducers({
  productPrices: getProductPrices,
  tab: getTabsReducer(paperHasDeliveryEnabled() ? initialTab : Collection),
});
