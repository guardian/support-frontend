// @flow

/* eslint-disable quote-props */
const numbersInWords = {
  '25': 'twenty five',
  '35': 'thirty five',
  '50': 'fifty',
  '75': 'seventy five',
  '100': 'one hundred',
  '125': 'one hundred and twenty five',
  '250': 'two hundred and fifty',
  '275': 'two hundred and seventy five',
};
/* eslint-enable  quote-props */

const VariantA = [
  { value: '25', spoken: numbersInWords['25'], isDefault: false },
  { value: '50', spoken: numbersInWords['50'], isDefault: false },
  { value: '100', spoken: numbersInWords['100'], isDefault: true },
  { value: '250', spoken: numbersInWords['250'], isDefault: false },
];

const VariantB = [
  { value: '35', spoken: numbersInWords['35'], isDefault: false },
  { value: '75', spoken: numbersInWords['75'], isDefault: true },
  { value: '125', spoken: numbersInWords['125'], isDefault: false },
  { value: '250', spoken: numbersInWords['250'], isDefault: false },
];

const Control = [
  { value: '25', spoken: numbersInWords['25'], isDefault: false },
  { value: '50', spoken: numbersInWords['50'], isDefault: true },
  { value: '100', spoken: numbersInWords['100'], isDefault: false },
  { value: '250', spoken: numbersInWords['250'], isDefault: false },
];

export const getUsSingleAmounts = (usSingleAmountsTestVariant: string) => {
  if (usSingleAmountsTestVariant === 'singleD100') {
    return VariantA;
  } else if (usSingleAmountsTestVariant === 'single3575') {
    return VariantB;
  }
  return Control;
};

