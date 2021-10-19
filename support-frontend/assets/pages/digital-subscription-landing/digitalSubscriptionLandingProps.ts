import type { ProductPrices } from 'helpers/productPrice/productPrices';
import {
	getGlobal,
	getProductPrices,
	getPromotionCopy,
} from 'helpers/globalsAndSwitches/globals';
import type { PromotionCopy } from 'helpers/productPrice/promotions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { detect as detectCountryGroup } from 'helpers/internationalisation/countryGroup';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { detect as detectCountry } from 'helpers/internationalisation/country';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { detect as detectCurrency } from 'helpers/internationalisation/currency';
import type { Participations } from 'helpers/abTests/abtest';
import { init as initAbTests } from 'helpers/abTests/abtest';
import { getSettings } from 'helpers/globalsAndSwitches/globals';
export type DigitalLandingPropTypes = {
	countryId: IsoCountry;
	countryGroupId: CountryGroupId;
	currencyId: IsoCurrency;
	participations: Participations;
	productPrices: ProductPrices | null | undefined;
	promotionCopy: PromotionCopy | null | undefined;
	orderIsAGift: boolean;
};
const countryGroupId = detectCountryGroup();
const countryId = detectCountry();
export const digitalLandingProps = (): DigitalLandingPropTypes => ({
	countryId,
	countryGroupId,
	currencyId: detectCurrency(countryGroupId),
	participations: initAbTests(countryId, countryGroupId, getSettings()),
	productPrices: getProductPrices(),
	promotionCopy: getPromotionCopy(),
	orderIsAGift: getGlobal('orderIsAGift') || false,
});
