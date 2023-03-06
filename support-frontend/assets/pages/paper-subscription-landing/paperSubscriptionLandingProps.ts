import type { Participations } from 'helpers/abTests/abtest';
import { init as initAbTests } from 'helpers/abTests/abtest';
import {
	getProductPrices,
	getPromotionCopy,
	getSettings,
} from 'helpers/globalsAndSwitches/globals';
import { detect as detectCountry } from 'helpers/internationalisation/country';
import { detect as detectCountryGroup } from 'helpers/internationalisation/countryGroup';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import type { PromotionCopy } from 'helpers/productPrice/promotions';

export type PaperLandingContentPropTypes = {
	productPrices: ProductPrices | null | undefined;
	promotionCopy: PromotionCopy | null | undefined;
	isPriceCardsAbTestVariant?: boolean;
};

export type PaperLandingPropTypes = {
	productPrices: ProductPrices | null | undefined;
	promotionCopy: PromotionCopy | null | undefined;
	participations: Participations;
};

const countryGroupId = detectCountryGroup();

export const paperLandingProps = (): PaperLandingPropTypes => ({
	productPrices: getProductPrices(),
	promotionCopy: getPromotionCopy(),
	participations: initAbTests(detectCountry(), countryGroupId, getSettings()),
});
