// @flow

// ----- Imports ----- //

import { roundDp } from 'helpers/utilities';


// ----- Functions ----- //

function validateContribution(
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


// ----- Exports ----- //

export default validateContribution;
