// ----- Functions ----- //

export default function validateOtherAmount(amount, contribType) {

  if (amount === '') {
    return 'noEntry';
  }

  const numericAmount = Number(amount);

  if (numericAmount < 5 && contribType === 'RECURRING') {
    return 'tooLittleRecurring';
  } else if (numericAmount < 1 && contribType === 'ONE_OFF') {
    return 'tooLittleOneOff';
  } else if (numericAmount > 2000) {
    return 'tooMuch';
  }

  return '';

}
