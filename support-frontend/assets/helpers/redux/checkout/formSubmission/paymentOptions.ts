import type { ContributionType } from 'helpers/contributions';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import { logException } from 'helpers/utilities/logger';

type PaymentOptions = Partial<Record<PaymentMethod, true>>;

const recurringPaymentOptions: PaymentOptions = {
	DirectDebit: true,
	ExistingCard: true,
	ExistingDirectDebit: true,
	PayPal: true,
	Sepa: true,
	Stripe: true,
};

export const validPaymentMethods: Record<ContributionType, PaymentOptions> = {
	ONE_OFF: {
		Stripe: true,
		AmazonPay: true,
	},
	MONTHLY: recurringPaymentOptions,
	ANNUAL: recurringPaymentOptions,
};

function logInvalidCombination(
	contributionType: ContributionType,
	paymentMethod: PaymentMethod,
): void {
	logException(
		`Invalid combination of contribution type ${contributionType} and payment method ${paymentMethod}`,
	);
}

export function isValidPaymentMethodForContributionType(
	contributionType: ContributionType,
	paymentMethod: PaymentMethod,
): boolean {
	if (validPaymentMethods[contributionType][paymentMethod]) {
		return true;
	}
	logInvalidCombination(contributionType, paymentMethod);
	return false;
}
