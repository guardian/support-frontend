/* eslint-env browser -- allow usage of window/document globals in Storybook */
import { productCatalogFixture } from 'fixtures/productCatalogFixture';

function ensureProductCatalog() {
    if (typeof window === 'undefined') {
        return;
	}

	window.guardian = window.guardian || {};

	window.guardian.productCatalog = productCatalogFixture;
}

export function withProductCatalog(storyFn) {
    ensureProductCatalog();
	return storyFn();
}
