import type { PaperFulfilmentOptions } from '@modules/product/fulfilmentOptions';
import type { PromoWithCatalogInformation } from '@modules/promotions/v2/schema';
import type { Participations } from 'helpers/abTests/models';
import type { WindowProductCatalog } from 'helpers/globalsAndSwitches/window';
import { getQueryParameter } from 'helpers/urls/url';

export type PaperLandingPropTypes = {
	productCatalog: WindowProductCatalog;
	promotions: PromoWithCatalogInformation[];
	promoCode?: string;
	participations: Participations;
	fulfilment?: PaperFulfilmentOptions;
};

export const paperLandingProps = (
	participations: Participations,
): PaperLandingPropTypes => ({
	productCatalog: window.guardian.productCatalog,
	promotions: window.guardian.promotions ?? [],
	promoCode: getQueryParameter('promoCode'),
	participations,
});
