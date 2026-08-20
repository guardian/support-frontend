import type { CountryCode } from '@modules/internationalisation/country';
import type { ProductKey } from '@modules/product-catalog/productCatalog';
import {
	DirectDebit,
	PayPalCompletePayments,
	Stripe,
	StripeHostedCheckout,
} from 'helpers/forms/paymentMethods';
import type { ActiveRatePlanKey } from 'helpers/productCatalog';
import { isSundayOnlyNewspaperSub } from 'pages/[countryGroupId]/helpers/isSundayOnlyNewspaperSub';

export const getPaymentMethods = (
	countryId: CountryCode,
	productKey: ProductKey,
	ratePlanKey: ActiveRatePlanKey,
) => {
	const maybeDirectDebit = countryId === 'GB' && DirectDebit;

	if (isSundayOnlyNewspaperSub(productKey, ratePlanKey)) {
		return [maybeDirectDebit, StripeHostedCheckout];
	}

	return [maybeDirectDebit, Stripe, PayPalCompletePayments];
};
