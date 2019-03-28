// @flow
import type { ProductPrices } from 'helpers/productPrice/productPrices';

function getGlobal<T>(key: string): ?T {
  if (window.guardian && window.guardian[key]) {
    return window.guardian[key];
  }
  return null;
}

const getProductPrices = (): ?ProductPrices => getGlobal('productPrices');

export { getProductPrices, getGlobal };
