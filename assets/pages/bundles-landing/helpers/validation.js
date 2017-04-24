// @flow

// ----- Imports ----- //

import type { Contrib, ContribError, Amount } from '../reducers/reducers';


// ----- Functions ----- //

function validateOtherAmount(amount: Amount, contrib: Contrib): ?ContribError {

  if (amount.value === '') {
    return 'noEntry';
  }

  const numericAmount = Number(amount.value);

  if (numericAmount < 5 && contrib === 'RECURRING') {
    return 'tooLittleRecurring';
  } else if (numericAmount < 1 && contrib === 'ONE_OFF') {
    return 'tooLittleOneOff';
  } else if (numericAmount > 2000) {
    return 'tooMuch';
  }

  return null;

}


// ----- Exports ----- //

export default validateOtherAmount;
