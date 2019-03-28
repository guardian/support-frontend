// @flow
import type { ProductPrices } from 'helpers/productPrice/productPrices';

function getGlobal<T>(key: string): ?T {
  if (window.guardian && window.guardian[key]) {
    return window.guardian[key];
  }
  return null;
}

const getProductPrices = (): ?ProductPrices => getGlobal('productPrices');


type ExperimentSwitch = {
  state: ?string,
}
const getExperimentSwitch = (key: string): ExperimentSwitch => {
  const settings = getGlobal('settings');
  if (settings && settings.switches.experiments && settings.switches.experiments[key]) {
    return settings.switches.experiments[key];
  }
  return { state: null };
};

export { getProductPrices, getGlobal, getExperimentSwitch };
