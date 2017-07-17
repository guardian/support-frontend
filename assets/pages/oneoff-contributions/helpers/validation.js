// @flow

// ----- Imports ----- //

import { roundDp } from 'helpers/utilities';


// ----- Functions ----- //

function validateContribution(amount: string): number {

  const numericAmount = Number(amount);

  if (
    isNaN(numericAmount) ||
    numericAmount < 1 ||
    numericAmount > 2000
  ) {
    return 50;
  }

  // Converts to 2.d.p.
  return roundDp(numericAmount);

}


// ----- Exports ----- //

export default validateContribution;
