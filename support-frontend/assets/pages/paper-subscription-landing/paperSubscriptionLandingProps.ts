import type { Participations } from 'helpers/abTests/abtest';
import { init as initAbTests } from 'helpers/abTests/abtest';
import {
	getProductPrices,
	getPromotionCopy,
} from 'helpers/globalsAndSwitches/globals';
import { Country, CountryGroup } from 'helpers/internationalisation/helpers';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import type { PromotionCopy } from 'helpers/productPrice/promotions';

export type PaperLandingContentPropTypes = {
	productPrices: ProductPrices | null | undefined;
	promotionCopy: PromotionCopy | null | undefined;
};

export type PaperLandingPropTypes = {
	productPrices: ProductPrices | null | undefined;
	promotionCopy: PromotionCopy | null | undefined;
	participations: Participations;
};

const countryGroupId = CountryGroup.detect();

export const paperLandingProps = (): PaperLandingPropTypes => ({
	productPrices: getProductPrices(),
	promotionCopy: getPromotionCopy(),
	participations: initAbTests(Country.detect(), countryGroupId),
});
