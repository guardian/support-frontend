import type { IsoCountry } from '@modules/internationalisation/country';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
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
	orderIsAGift: boolean;
};

const countryGroupId = CountryGroup.detect();

export const weeklyLandingProps = (): WeeklyLandingPropTypes => ({
	countryGroupId,
	countryId: Country.detect(),
	productPrices: getProductPrices(),
	promotionCopy: getPromotionCopy(),
	orderIsAGift: getGlobal('orderIsAGift') ?? false,
});
