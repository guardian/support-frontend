// @flow

import { type AmountsRegions } from 'helpers/contributions';

export const annualAmountsControl: AmountsRegions = {
  // Use the config from server
};

export const annualAmountsA: AmountsRegions = {
  GBPCountries: {
    ANNUAL: [
      {
        value: '50',
      },
      {
        value: '77',
        isDefault: true,
      },
      {
        value: '250',
      },
      {
        value: '500',
      },
    ],
  },
  UnitedStates: {
    ANNUAL: [
      {
        value: '50',
      },
      {
        value: '100',
        isDefault: true,
      },
      {
        value: '250',
      },
      {
        value: '500',
      },
    ],
  },
  EURCountries: {
    ANNUAL: [
      {
        value: '50',
      },
      {
        value: '100',
        isDefault: true,
      },
      {
        value: '250',
      },
      {
        value: '500',
      },
    ],
  },
  AUDCountries: {
    ANNUAL: [
      {
        value: '100',
        isDefault: true,
      },
      {
        value: '250',
      },
      {
        value: '500',
      },
      {
        value: '750',
      },
    ],
  },
  International: {
    ANNUAL: [
      {
        value: '50',
      },
      {
        value: '100',
        isDefault: true,
      },
      {
        value: '250',
      },
      {
        value: '500',
      },
    ],
  },
  NZDCountries: {
    ANNUAL: [
      {
        value: '50',
        isDefault: true,
      },
      {
        value: '100',
      },
      {
        value: '250',
      },
      {
        value: '500',
      },
    ],
  },
  Canada: {
    ANNUAL: [
      {
        value: '50',
      },
      {
        value: '100',
        isDefault: true,
      },
      {
        value: '250',
      },
      {
        value: '500',
      },
    ],
  },
};
