import type { IsoCountry } from '@modules/internationalisation/country';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import type { Participations } from 'helpers/abTests/models';
import {
	getGlobal,
	getProductPrices,
	getPromotionCopy,
} from 'helpers/globalsAndSwitches/globals';
import { Country } from 'helpers/internationalisation/classes/country';
import { CountryGroup } from 'helpers/internationalisation/classes/countryGroup';
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

const countryGroupId = CountryGroup.detect();

export const weeklyLandingProps = (
	participations: Participations,
): WeeklyLandingPropTypes => ({
	countryGroupId,
	countryId: Country.detect(),
	productPrices: getProductPrices(),
	promotionCopy: getPromotionCopy(),
	orderIsAGift: getGlobal('orderIsAGift'),
	participations,
});
