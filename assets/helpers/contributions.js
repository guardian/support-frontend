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

export type validatedContrib = {
  amount: number,
  error: ContribError,
};


// ----- Setup ----- //

const LIMITS = {
  max: 2000,
  min: {
    RECURRING: 5,
    ONE_OFF: 1,
  },
};

const DEFAULT_AMOUNTS = {
  RECURRING: 5,
  ONE_OFF: 50,
};


// ----- Functions ----- //

export default function validate(input: string, contrib: Contrib) {

  let error = null;

  const numericAmount = Number(input);

  if (input === '' || isNaN(numericAmount)) {
    error = 'invalidEntry';
  } else if (numericAmount < LIMITS.min[contrib]) {
    error = contrib === 'RECURRING' ? 'tooLittleRecurring' : 'tooLittleOneOff';
  } else if (numericAmount > LIMITS.max) {
    error = 'tooMuch';
  }

  const amount = error ? DEFAULT_AMOUNTS[contrib] : roundDp(numericAmount);

  return { error, amount };

}
