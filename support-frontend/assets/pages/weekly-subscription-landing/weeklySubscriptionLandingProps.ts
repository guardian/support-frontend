import type { Participations } from 'helpers/abTests/abtest';
import { init as initAbTests } from 'helpers/abTests/abtest';
import {
	getGlobal,
	getProductPrices,
	getPromotionCopy,
	getSettings,
} from 'helpers/globalsAndSwitches/globals';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { detect as detectCountry } from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { detect as detectCountryGroup } from 'helpers/internationalisation/countryGroup';
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
	isPriceCardsAbTestVariant?: boolean;
};

const countryGroupId = detectCountryGroup();

export const weeklyLandingProps = (): WeeklyLandingPropTypes => ({
	countryGroupId,
	countryId: detectCountry(),
	productPrices: getProductPrices(),
	promotionCopy: getPromotionCopy(),
	orderIsAGift: getGlobal('orderIsAGift'),
	participations: initAbTests(detectCountry(), countryGroupId, getSettings()),
});
