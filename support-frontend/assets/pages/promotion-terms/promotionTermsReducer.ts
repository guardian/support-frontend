// ----- Imports ----- //
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import {
	getGlobal,
	getProductPrices,
} from 'helpers/globalsAndSwitches/globals';
import { CountryGroup } from 'helpers/internationalisation/classes/countryGroup';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import type { PromotionTerms } from 'helpers/productPrice/promotions';

export type PromotionTermsPropTypes = {
	productPrices: ProductPrices;
	promotionTerms: PromotionTerms;
	countryGroupId: CountryGroupId;
};

// ----- Export ----- //

export default function getPromotionTermsProps(): PromotionTermsPropTypes {
	const productPrices = getProductPrices() as ProductPrices;
	const terms = getGlobal<PromotionTerms>('promotionTerms');
	const expires = terms?.expires ? new Date(terms.expires) : null;
	const starts = terms ? new Date(terms.starts) : new Date();
	const countryGroupId = CountryGroup.detect();
	return {
		productPrices,
		promotionTerms: { ...terms, starts, expires } as PromotionTerms,
		countryGroupId,
	};
}
