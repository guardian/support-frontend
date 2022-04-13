// ----- Imports ----- //
import {
	getGlobal,
	getProductPrices,
} from 'helpers/globalsAndSwitches/globals';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { detect } from 'helpers/internationalisation/countryGroup';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import type { PromotionTerms } from 'helpers/productPrice/promotions';
import type { CommonState } from 'helpers/redux/commonState/state';

export type PromotionTermsPropTypes = {
	productPrices: ProductPrices;
	promotionTerms: PromotionTerms;
	countryGroupId: CountryGroupId;
};

export type State = {
	common: CommonState;
	page: PromotionTermsPropTypes;
};

// ----- Export ----- //

export default function getPromotionTermsProps(): PromotionTermsPropTypes {
	const productPrices = getProductPrices() as ProductPrices;
	const terms = getGlobal<PromotionTerms>('promotionTerms');
	const expires = terms?.expires ? new Date(terms.expires) : null;
	const starts = terms ? new Date(terms.starts) : new Date();
	const countryGroupId = detect();
	return {
		productPrices,
		promotionTerms: { ...terms, starts, expires } as PromotionTerms,
		countryGroupId,
	};
}
