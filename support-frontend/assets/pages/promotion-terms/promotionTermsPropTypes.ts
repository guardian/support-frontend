import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import type { PromoWithCatalogInformation } from '@modules/promotions/v2/schema';

export type PromotionTermsPropTypes = {
	promotion?: PromoWithCatalogInformation;
	countryGroupId: CountryGroupId;
};
