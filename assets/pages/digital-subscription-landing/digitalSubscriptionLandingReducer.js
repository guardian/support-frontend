// @flow

// ----- Imports ----- //
import { combineReducers } from 'redux';
import type { Store } from 'redux';

import { getEndTime as getFlashSaleEndTime } from 'helpers/flashSale';
import type { CommonState } from 'helpers/page/page';

import { countdownActionsFor } from 'components/countdown/countdownActions';
import { countdownReducerFor } from 'components/countdown/countdownReducer';
import promotionPopUpReducer from './components/promotionPopUpReducer';
import type { FindOutMoreState } from './components/promotionPopUpReducer';


// ----- Types ----- //

export type State = {
  common: CommonState,
  page: {
    promotionPopUp: FindOutMoreState,
    flashCountdown: number,
  };
}

// ----- Reducer ----- //

const flashSaleReduxScope = 'flashSale';

const initReducer = () => combineReducers({
  promotionPopUp: promotionPopUpReducer,
  flashCountdown: countdownReducerFor(flashSaleReduxScope, getFlashSaleEndTime()),
});

const afterInit = (store: Store<*, *, *>) => {
  store.dispatch(countdownActionsFor(flashSaleReduxScope).tick());
};

export { initReducer, afterInit };
