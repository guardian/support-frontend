import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import type { PromotionTerms } from 'helpers/productPrice/promotions';

export type PromotionTermsPropTypes = {
	promotionTerms: PromotionTerms;
	countryGroupId: CountryGroupId;
};
