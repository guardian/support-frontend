// @flow

// ----- Imports ----- //

import { combineReducers } from 'redux';
import type { CommonState } from 'helpers/page/commonReducer';

import { type TabActions } from './paperSubscriptionLandingPageActions';
import { Collection, type PaperFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { paperHasDeliveryEnabled } from 'helpers/productPrice/subscriptions';
import { getProductPrices, getPromotionCopy } from 'helpers/globalsAndSwitches/globals';
import type { PromotionCopy } from 'helpers/productPrice/promotions';


// ----- Types ----- //

export type ActiveTabState = PaperFulfilmentOptions;

export type State = {
  common: CommonState,
  page: {
    productPrices: ?ProductPrices,
    promotionCopy: ?PromotionCopy,
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
  promotionCopy: getPromotionCopy,
  tab: getTabsReducer(paperHasDeliveryEnabled() ? initialTab : Collection),
});
