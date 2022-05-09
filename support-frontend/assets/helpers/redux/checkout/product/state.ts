import type {
	ContributionType,
	OtherAmounts,
	SelectedAmounts,
} from 'helpers/contributions';
import { detect as detectCountryGroup } from 'helpers/internationalisation/countryGroup';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type { ProductOptions } from 'helpers/productPrice/productOptions';
import { getCurrency } from 'helpers/productPrice/productPrices';
import type { Promotion } from 'helpers/productPrice/promotions';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';

export type GuardianProduct =
	| SubscriptionProduct
	| ContributionType
	| 'NoProduct';

export type AmountChange = {
	contributionType: ContributionType;
	amount: number;
};

export type ProductState = {
	product: GuardianProduct;
	productOption: ProductOptions;
	fulfilmentOption: FulfilmentOptions;
	selectedAmounts: SelectedAmounts;
	otherAmounts: OtherAmounts;
	currency: IsoCurrency;
	fixedTerm: boolean;
	savingVsRetail?: number;
	promotions?: Promotion[];
	redemptionCode?: string;
};

export const initialProductState: ProductState = {
	product: 'NoProduct',
	productOption: 'NoProductOptions',
	fulfilmentOption: 'NoFulfilmentOptions',
	selectedAmounts: {
		ONE_OFF: 0,
		MONTHLY: 0,
		ANNUAL: 0,
	},
	otherAmounts: {
		ONE_OFF: {
			amount: null,
		},
		MONTHLY: {
			amount: null,
		},
		ANNUAL: {
			amount: null,
		},
	},
	currency: getCurrency(detectCountryGroup()),
	fixedTerm: false,
};
