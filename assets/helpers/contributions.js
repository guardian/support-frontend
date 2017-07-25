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

type Config = {
  [Contrib]: {
    min: number,
    max: number,
    default: number,
  }
}


// ----- Setup ----- //

const CONFIG: Config = {
  RECURRING: {
    min: 5,
    max: 2000,
    default: 10,
  },
  ONE_OFF: {
    min: 1,
    max: 2000,
    default: 50,
  },
};


// ----- Functions ----- //

export default function validate(input: string, contrib: Contrib) {

  let error = null;
  const numericAmount = Number(input);

  if (input === '' || isNaN(numericAmount)) {
    error = 'invalidEntry';
  } else if (numericAmount < CONFIG[contrib].min) {
    error = contrib === 'RECURRING' ? 'tooLittleRecurring' : 'tooLittleOneOff';
  } else if (numericAmount > CONFIG[contrib].max) {
    error = 'tooMuch';
  }

  const amount = error ? CONFIG[contrib].default : roundDp(numericAmount);

  return { error, amount };

}
