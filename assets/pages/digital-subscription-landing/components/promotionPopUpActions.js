// @flow

export type PromotionOptions = 'Saturday' | 'Sunday' | 'Weekend';
export type Action =
  | { type: 'OPEN_POP_UP' }
  | { type: 'CLOSE_POP_UP' }
  | { type: 'EXPAND_OPTION', option: PromotionOptions };

const openPopUp = (): Action =>
  ({ type: 'OPEN_POP_UP' });

const closePopUp = (): Action =>
  ({ type: 'CLOSE_POP_UP' });

const expandOption = (option: PromotionOptions): Action =>
  ({ type: 'EXPAND_OPTION', option });

export { openPopUp, closePopUp, expandOption };
