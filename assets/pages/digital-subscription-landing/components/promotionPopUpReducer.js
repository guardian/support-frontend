// @flow

// ----- Imports ----- //

import { type CommonState } from 'helpers/page/commonReducer';
import type { Action, PromotionOptions } from './promotionPopUpActions';

// ----- Setup ----- //

export type FindOutMoreState = {
  isPopUpOpen: boolean,
  expandedOption: PromotionOptions,
};

export type State = {
  common: CommonState,
  page: FindOutMoreState,
};

const initialState: FindOutMoreState = {
  isPopUpOpen: false,
  expandedOption: 'Saturday',
};

export default function promotionPopUpReducer(
  state: FindOutMoreState = initialState,
  action: Action,
) {
  switch (action.type) {
    case 'OPEN_POP_UP':
      return { ...state, isPopUpOpen: true };
    case 'CLOSE_POP_UP':
      return { ...state, isPopUpOpen: false };
    case 'EXPAND_OPTION':
      return { ...state, expandedOption: action.option };
    default:
      return state;
  }
}
