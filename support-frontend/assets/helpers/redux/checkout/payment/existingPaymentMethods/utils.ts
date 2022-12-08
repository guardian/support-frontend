import { isSwitchOn } from 'helpers/globalsAndSwitches/globals';

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
