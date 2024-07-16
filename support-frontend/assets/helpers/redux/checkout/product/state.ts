import { z } from 'zod';
import type {
	ContributionType,
	OtherAmounts,
	SelectedAmounts,
} from 'helpers/contributions';
import { getGlobal } from 'helpers/globalsAndSwitches/globals';
import { Country } from 'helpers/internationalisation';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type { ProductOptions } from 'helpers/productPrice/productOptions';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { getCurrency } from 'helpers/productPrice/productPrices';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import type { DateYMDString } from 'helpers/types/DateString';
import { formatMachineDate } from 'helpers/utilities/dateConversions';

const maxOneDecimalPlaceRegex = /^\d+\.?\d{0,2}$/;

export const otherAmountSchema = z.object({
	amount: z
		.string({ invalid_type_error: 'Please enter an amount' })
		.regex(maxOneDecimalPlaceRegex, { message: 'Please enter a valid amount' }),
});

export type GuardianProduct =
	| SubscriptionProduct
	| ContributionType
	| 'NoProduct';

type ProductErrors = {
	otherAmount?: string[];
};

// TODO: Fix the type difference between pre-selected amounts and custom amounts
// Probably best to handle everything as strings
export type AmountChange = {
	contributionType: ContributionType;
	amount: string; // this is normally a number stringified || 'other';
};

export type ProductState = {
	productType: GuardianProduct;
	productOption: ProductOptions;
	fulfilmentOption: FulfilmentOptions;
	billingPeriod: BillingPeriod;
	productPrices: ProductPrices;
	supporterPlusProductPrices: ProductPrices;
	tierThreeProductPrices: ProductPrices;
	selectedAmounts: SelectedAmounts;
	otherAmounts: OtherAmounts;
	selectedAmountsBeforeAmendment: SelectedAmounts;
	otherAmountsBeforeAmendment: OtherAmounts;
	currency: IsoCurrency;
	orderIsAGift: boolean;
	startDate: DateYMDString;
	errors: ProductErrors;
};

const currency = getCurrency(Country.detect());

export const initialProductState: ProductState = {
	productType: 'NoProduct',
	productOption: 'NoProductOptions',
	fulfilmentOption: 'NoFulfilmentOptions',
	billingPeriod: 'Monthly',
	productPrices: getGlobal('productPrices') ?? {},
	supporterPlusProductPrices: getGlobal('supporterPlusProductPrices') ?? {},
	tierThreeProductPrices: getGlobal('tierThreeProductPrices') ?? {},
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
	selectedAmountsBeforeAmendment: {
		ONE_OFF: 0,
		MONTHLY: 0,
		ANNUAL: 0,
	},
	otherAmountsBeforeAmendment: {
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
	orderIsAGift: getGlobal('orderIsAGift') ?? false,
	startDate: formatMachineDate(new Date()),
	errors: {},
};
