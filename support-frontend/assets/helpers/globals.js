// @flow
import type { ProductPrices } from 'helpers/productPrice/productPrices';

function getGlobal<T>(key: string): ?T {
  if (window.guardian && window.guardian[key]) {
    return window.guardian[key];
  }
  return null;
}

const getProductPrices = (): ?ProductPrices => getGlobal('productPrices');

const isTestSwitchedOn = (testName: string): boolean => {
  const settings = getGlobal('settings');
  if (settings && settings.switches.experiments && settings.switches.experiments[testName]) {
    const test = settings.switches.experiments[testName];
    return !!(test && test.state && test.state === 'On');
  }
  return false;
};


export { getProductPrices, getGlobal, isTestSwitchedOn };
