// @flow

// ----- Imports --- //

import type { Radio } from 'components/radioToggle/radioToggle';
import type { IsoCurrency } from 'helpers/internationalisation/currency';


// ----- Functions ----- //

const defaultAmountsUK = {
  control: '10',
  lower: '5',
  wildcard: '7',
  notintest: '10',
};

const defaultAmountsUS = {
  control: '10',
  higher: '15',
  lower: '5',
  notintest: '10',
};

const amountRadiosMonthlyHigher: {
  [IsoCurrency]: Radio[]
} = {
  USD: [
    {
      value: '7',
      text: '$7',
      accessibilityHint: 'contribute seven dollars per month',
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

const amountRadiosMonthlyLower: {
  [IsoCurrency]: Radio[]
} = {
  GBP: [
    {
      value: '2',
      text: '£2',
      accessibilityHint: 'contribute two pounds per month',
    },
    {
      value: '5',
      text: '£5',
      accessibilityHint: 'contribute five pounds per month',
    },
    {
      value: '10',
      text: '£10',
      accessibilityHint: 'contribute ten pounds per month',
    },
  ],
  USD: [
    {
      value: '2',
      text: '$2',
      accessibilityHint: 'contribute two dollars per month',
    },
    {
      value: '5',
      text: '$5',
      accessibilityHint: 'contribute five dollars per month',
    },
    {
      value: '10',
      text: '$10',
      accessibilityHint: 'contribute ten dollars per month',
    },
  ],
};

const amountRadiosMonthlyWildcard: {
  [IsoCurrency]: Radio[]
} = {
  GBP: [
    {
      value: '5',
      text: '£5',
      accessibilityHint: 'contribute five pounds per month',
    },
    {
      value: '7',
      text: '£7',
      accessibilityHint: 'contribute seven pounds per month',
    },
    {
      value: '20',
      text: '£20',
      accessibilityHint: 'contribute twenty pounds per month',
    },
  ],
};


// ----- Exports ----- //

export {
  defaultAmountsUK,
  defaultAmountsUS,
  amountRadiosMonthlyHigher,
  amountRadiosMonthlyLower,
  amountRadiosMonthlyWildcard,
};
