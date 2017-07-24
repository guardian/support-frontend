// @flow

// ----- Imports ----- //

import { roundDp } from 'helpers/utilities';


// ----- Types ----- //

export type Contrib = 'RECURRING' | 'ONE_OFF';

export type ContribError =
  | 'tooLittleRecurring'
  | 'tooLittleOneOff'
  | 'tooMuch'
  | 'invalidEntry'
  ;

export type Amount = {
  value: string,
  userDefined: boolean,
};

export type Amounts = {
  recurring: Amount,
  oneOff: Amount,
};


// ----- Setup ----- //

const limits = {
  max: 2000,
  min: {
    monthly: 5,
    oneOff: 1,
  },
};


// ----- Functions ----- //

export function checkError(amount: Amount, contrib: Contrib): ?ContribError {

  if (amount.value === '') {
    return 'invalidEntry';
  }

  const numericAmount = Number(amount.value);

  if (isNaN(numericAmount)) {
    return 'invalidEntry';
  } else if (numericAmount < limits.min.monthly && contrib === 'RECURRING') {
    return 'tooLittleRecurring';
  } else if (numericAmount < limits.min.oneOff && contrib === 'ONE_OFF') {
    return 'tooLittleOneOff';
  } else if (numericAmount > limits.max) {
    return 'tooMuch';
  }

  return null;

}

export function validate(
  amount: string,
  lowBound: number,
  upperBound: number,
  defaultValue: number,
): number {
  const numericAmount = Number(amount);

  if (
    isNaN(numericAmount) ||
    numericAmount < lowBound ||
    numericAmount > upperBound
  ) {
    return defaultValue;
  }

  // Converts to 2.d.p.
  return roundDp(numericAmount);

}
