import type { Participations } from 'helpers/abTests/abtest';
import { init as initAbTests } from 'helpers/abTests/abtest';
import {
	getProductPrices,
	getPromotionCopy,
} from 'helpers/globalsAndSwitches/globals';
import { CountryHelper } from 'helpers/internationalisation/classes/country';
import { CountryGroupHelper } from 'helpers/internationalisation/classes/countryGroup';
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

const countryGroupId = CountryGroupHelper.detect();

const abtestInitalizerData = {
	countryId: CountryHelper.detect(),
	countryGroupId,
};

export const paperLandingProps = (): PaperLandingPropTypes => ({
	productPrices: getProductPrices(),
	promotionCopy: getPromotionCopy(),
	participations: initAbTests(abtestInitalizerData),
});
