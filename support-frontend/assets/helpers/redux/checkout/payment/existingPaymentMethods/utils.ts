import { isSwitchOn } from 'helpers/globalsAndSwitches/globals';
import type {
	ExistingPaymentMethod,
	RecentlySignedInExistingPaymentMethod,
} from './state';

type ExistingPaymentMethodSwitchState = {
	directDebit: boolean;
	card: boolean;
};

export function getExistingPaymentMethodSwitchState(): ExistingPaymentMethodSwitchState {
	return {
		card: isSwitchOn('recurringPaymentMethods.existingCard'),
		directDebit: isSwitchOn('recurringPaymentMethods.existingDirectDebit'),
	};
}

function isUsableExistingPaymentMethod(
	existingPaymentMethod: ExistingPaymentMethod,
): existingPaymentMethod is RecentlySignedInExistingPaymentMethod {
	if ('billingAccountId' in existingPaymentMethod) {
		return !!existingPaymentMethod.billingAccountId;
	}
	return false;
}

export function getUsableExistingPaymentMethods(
	paymentMethods: ExistingPaymentMethod[],
): RecentlySignedInExistingPaymentMethod[] {
	const switchState = getExistingPaymentMethodSwitchState();

	return paymentMethods.filter<RecentlySignedInExistingPaymentMethod>(
		(paymentMethod): paymentMethod is RecentlySignedInExistingPaymentMethod => {
			if (isUsableExistingPaymentMethod(paymentMethod)) {
				return (
					(paymentMethod.paymentType === 'Card' && switchState.card) ||
					(paymentMethod.paymentType === 'DirectDebit' &&
						switchState.directDebit)
				);
			}
			return false;
		},
	);
}
