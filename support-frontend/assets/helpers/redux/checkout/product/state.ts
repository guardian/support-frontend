import type {
	ContributionType,
	OtherAmounts,
	SelectedAmounts,
} from 'helpers/contributions';
import { detect as detectCountryGroup } from 'helpers/internationalisation/countryGroup';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type { ProductOptions } from 'helpers/productPrice/productOptions';
import type {
	ProductPrice,
	ProductPrices,
} from 'helpers/productPrice/productPrices';
import { getCurrency } from 'helpers/productPrice/productPrices';
import type { Promotion } from 'helpers/productPrice/promotions';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';

export type GuardianProduct =
	| SubscriptionProduct
	| ContributionType
	| 'NoProduct';

// TODO: Fix the type difference between pre-selected amounts and custom amounts
// Probably best to handle everything as strings
export type AmountChange = {
	contributionType: ContributionType;
	amount: string | 'other';
};

export type ProductState = {
	productType: GuardianProduct;
	productOption: ProductOptions;
	fulfilmentOption: FulfilmentOptions;
	billingPeriod: BillingPeriod;
	productPrices: ProductPrices;
	selectedProductPrice: ProductPrice;
	selectedAmounts: SelectedAmounts;
	otherAmounts: OtherAmounts;
	currency: IsoCurrency;
	orderIsAGift: boolean;
	discountedProductPrice?: ProductPrice;
	savingVsRetail?: number;
	promotions?: Promotion[];
};

const currency = getCurrency(detectCountryGroup());

export const initialProductState: ProductState = {
	productType: 'NoProduct',
	productOption: 'NoProductOptions',
	fulfilmentOption: 'NoFulfilmentOptions',
	billingPeriod: 'Monthly',
	productPrices: window.guardian.productPrices,
	selectedProductPrice: {
		price: 0,
		currency,
		fixedTerm: false,
	},
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
	currency,
	orderIsAGift: false,
};
