// @flow

export type Action =
  | { type: 'OPEN_POP_UP' }
  | { type: 'CLOSE_POP_UP' };

const openPopUp = (): Action => {
  return { type: 'OPEN_POP_UP' };
};

const closePopUp = (): Action =>
  ({ type: 'CLOSE_POP_UP' });

export { openPopUp, closePopUp }
