// @flow
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { type Settings } from 'helpers/settings';

function getGlobal<T>(path: string = ''): ?T {

  const value = path
    .replace(/\[(.+?)\]/g, '.$1')
    .split('.')
    .reduce((o, key: any) => o && o[key], window.guardian);

  if (value) {
    return ((value: any): T);
  }

  return null;
}

const getSettings = (): Settings => getGlobal('settings') || {
  switches: {
    experiments: {},
  },
  amounts: {
    GBPCountries: {
      ONE_OFF: [],
      MONTHLY: [],
      ANNUAL: [],
    },
    UnitedStates: {
      ONE_OFF: [],
      MONTHLY: [],
      ANNUAL: [],
    },
    EURCountries: {
      ONE_OFF: [],
      MONTHLY: [],
      ANNUAL: [],
    },
    AUDCountries: {
      ONE_OFF: [],
      MONTHLY: [],
      ANNUAL: [],
    },
    International: {
      ONE_OFF: [],
      MONTHLY: [],
      ANNUAL: [],
    },
    NZDCountries: {
      ONE_OFF: [],
      MONTHLY: [],
      ANNUAL: [],
    },
    Canada: {
      ONE_OFF: [],
      MONTHLY: [],
      ANNUAL: [],
    },
  },
  contributionTypes: {
    GBPCountries: [],
    UnitedStates: [],
    EURCountries: [],
    AUDCountries: [],
    International: [],
    NZDCountries: [],
    Canada: [],
  },
};

const getProductPrices = (): ?ProductPrices => getGlobal('productPrices');

const isSwitchOn = (switchName: string): boolean => {
  const sw = getGlobal(`settings.switches.${switchName}`);
  return !!(sw && sw === 'On');
};

const isTestSwitchedOn = (testName: string): boolean => {
  const test = getGlobal(`settings.switches.experiments${testName}`);
  if (test) {
    return !!(test && test.state && test.state === 'On');
  }
  return false;
};


export { getProductPrices, getGlobal, isTestSwitchedOn, getSettings, isSwitchOn };
