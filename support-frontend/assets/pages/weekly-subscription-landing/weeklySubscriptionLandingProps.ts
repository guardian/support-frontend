import type { Participations } from 'helpers/abTests/abtest';
import { init as initAbTests } from 'helpers/abTests/abtest';
import {
	getGlobal,
	getProductPrices,
	getPromotionCopy,
} from 'helpers/globalsAndSwitches/globals';
import { CountryHelper } from 'helpers/internationalisation/classes/country';
import { CountryGroupHelper } from 'helpers/internationalisation/classes/countryGroup';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import type { PromotionCopy } from 'helpers/productPrice/promotions';

export type WeeklyLandingPropTypes = {
	countryId: IsoCountry;
	countryGroupId: CountryGroupId;
	productPrices: ProductPrices | null | undefined;
	promotionCopy: PromotionCopy | null | undefined;
	orderIsAGift: boolean | null | undefined;
	participations: Participations;
};

export type WeeklyLPContentPropTypes = {
	countryId: IsoCountry;
	countryGroupId: CountryGroupId;
	productPrices: ProductPrices;
	promotionCopy: PromotionCopy;
	orderIsAGift: boolean;
	participations: Participations;
	pageQaId: string;
	header: JSX.Element;
	giftNonGiftLink: string;
};

const countryGroupId = CountryGroupHelper.detect();
const abtestInitalizerData = {
	countryId: CountryHelper.detect(),
	countryGroupId,
};

export const weeklyLandingProps = (): WeeklyLandingPropTypes => ({
	countryGroupId,
	countryId: CountryHelper.detect(),
	productPrices: getProductPrices(),
	promotionCopy: getPromotionCopy(),
	orderIsAGift: getGlobal('orderIsAGift'),
	participations: initAbTests(abtestInitalizerData),
});
