// @flow

// ----- Imports --- //

import type { Radio } from 'components/radioToggle/radioToggle';
import type { IsoCurrency } from 'helpers/internationalisation/currency';


// ----- Functions ----- //
const defaultAmountsUS = {
  control: '15',
  range: '15',
  higher: '35',

};


const amountRadiosMonthlyRange: {
  [IsoCurrency]: Radio[]
} = {
  USD: [
    {
      value: '3',
      text: '$3',
      accessibilityHint: 'contribute three dollars per month',
    },
    {
      value: '15',
      text: '$15',
      accessibilityHint: 'contribute fifteen dollars per month',
    },
    {
      value: '30',
      text: '$30',
      accessibilityHint: 'contribute thirty dollars per month',
    },
  ],
};

const amountRadiosMonthlyHigher: {
  [IsoCurrency]: Radio[]
} = {
  USD: [
    {
      value: '15',
      text: '$15',
      accessibilityHint: 'contribute fifteen dollars per month',
    },
    {
      value: '35',
      text: '$35',
      accessibilityHint: 'contribute thirty five dollars per month',
    },
    {
      value: '50',
      text: '$50',
      accessibilityHint: 'contribute fifty dollars per month',
    },
  ],
};

// ----- Exports ----- //
export {
  defaultAmountsUS,
  amountRadiosMonthlyRange,
  amountRadiosMonthlyHigher,
};
