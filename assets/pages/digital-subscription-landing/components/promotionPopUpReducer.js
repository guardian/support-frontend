// @flow

// ----- Imports ----- //

import type { Action, PromotionOptions } from './promotionPopUpActions';

// ----- Setup ----- //

export type FindOutMoreState = {
  isPopUpOpen: boolean,
  expandedOption: PromotionOptions,
};

const initialState: FindOutMoreState = {
  isPopUpOpen: false,
  expandedOption: 'Saturday',
};

function promotionPopUpReducer(
  state: FindOutMoreState = initialState,
  action: Action,
) {
  switch (action.type) {
    case 'OPEN_POP_UP':
      return Object.assign({}, state, {
        isPopUpOpen: true,
      });
    case 'CLOSE_POP_UP':
      return Object.assign({}, state, {
        isPopUpOpen: false,
      });
    case 'EXPAND_OPTION':
      return Object.assign({}, state, {
        expandedOption: action.option,
      });


    default:
      return state;
  }
}

export { promotionPopUpReducer };
