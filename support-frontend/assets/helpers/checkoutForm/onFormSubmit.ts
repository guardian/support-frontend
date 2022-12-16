import { invalidReason } from 'helpers/checkoutForm/checkoutForm';
import type { ContributionType } from 'helpers/contributions';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import type { UserTypeFromIdentityResponse } from 'helpers/redux/checkout/personalDetails/state';
import { trackCheckoutSubmitAttempt } from 'helpers/tracking/behaviour';

type OldFlowOrNewFlow = 'opf' | 'npf';
export type FormSubmitParameters = {
	flowPrefix: OldFlowOrNewFlow;
	paymentMethod: PaymentMethod;
	contributionType: ContributionType;
	isSignedIn: boolean;
	userTypeFromIdentityResponse: UserTypeFromIdentityResponse;
	setCheckoutFormHasBeenSubmitted: () => void;
	handlePayment?: () => void;
	formIsSubmittable: boolean;
	formIsValid: boolean;
	form: Record<string, any> | null;
};
export const onFormSubmit = (params: FormSubmitParameters) => {
	const componentId = `${params.paymentMethod}-${params.contributionType}-submit`;
	const userType = params.isSignedIn
		? 'signed-in'
		: params.userTypeFromIdentityResponse;

	if (params.formIsValid) {
		if (params.formIsSubmittable) {
			// For PayPal, we handle the payment elsewhere
			if (params.handlePayment) {
				params.handlePayment();
			}

			trackCheckoutSubmitAttempt(
				componentId,
				`${params.flowPrefix}-allowed-for-user-type-${userType}`,
				params.paymentMethod,
				'Contribution',
			);
		} else {
			trackCheckoutSubmitAttempt(
				componentId,
				`${params.flowPrefix}-blocked-because-user-type-is-${userType}`,
				params.paymentMethod,
				'Contribution',
			);
		}
	} else {
		trackCheckoutSubmitAttempt(
			componentId,
			`${params.flowPrefix}-blocked-because-form-not-valid${invalidReason(
				params.form,
			)}`,
			params.paymentMethod,
			'Contribution',
		);
	}

	params.setCheckoutFormHasBeenSubmitted();
};
