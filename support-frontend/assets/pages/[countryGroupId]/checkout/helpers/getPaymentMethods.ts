import type { IsoCountry } from '@modules/internationalisation/country';
import type { ProductKey } from '@modules/product-catalog/productCatalog';
import type { Participations } from 'helpers/abTests/models';
import {
	DirectDebit,
	PayPal,
	PayPalCompletePayments,
	Stripe,
	StripeHostedCheckout,
} from 'helpers/forms/paymentMethods';
import type { ActiveRatePlanKey } from 'helpers/productCatalog';
import { isSundayOnlyNewspaperSub } from 'pages/[countryGroupId]/helpers/isSundayOnlyNewspaperSub';

export const getPaymentMethods = (
	countryId: IsoCountry,
	productKey: ProductKey,
	ratePlanKey: ActiveRatePlanKey,
	participations: Participations,
) => {
	const maybeDirectDebit = countryId === 'GB' && DirectDebit;

	if (isSundayOnlyNewspaperSub(productKey, ratePlanKey)) {
		return [maybeDirectDebit, StripeHostedCheckout];
	}

	const payPalDependingOnABTest =
		participations.paypalMigrationRecurring === 'variant'
			? PayPalCompletePayments
			: PayPal;

	return [maybeDirectDebit, Stripe, payPalDependingOnABTest];
};
