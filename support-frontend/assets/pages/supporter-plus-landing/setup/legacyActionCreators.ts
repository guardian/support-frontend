// ----- Imports ----- //
import type { ErrorReason } from 'helpers/forms/errorReasons';
import type {
	IsoCountry,
	StateProvince,
} from 'helpers/internationalisation/country';
import type { ContributionsState } from 'helpers/redux/contributionsStore';
import type { Option } from 'helpers/types/option';

export type Action =
	| {
			type: 'PAYMENT_FAILURE';
			paymentError: ErrorReason;
	  }
	| {
			type: 'PAYMENT_WAITING';
			isWaiting: boolean;
	  }
	| {
			type: 'PAYMENT_SUCCESS';
	  };

const paymentWaiting = (isWaiting: boolean): Action => ({
	type: 'PAYMENT_WAITING',
	isWaiting,
});

const paymentFailure = (paymentError: ErrorReason): Action => ({
	type: 'PAYMENT_FAILURE',
	paymentError,
});

function getBillingCountryAndState(state: ContributionsState): {
	billingCountry: IsoCountry;
	billingState: Option<StateProvince>;
	postCode: string;
} {
	const {
		country: formCountry,
		state: formState,
		postCode,
	} = state.page.checkoutForm.billingAddress.fields;

	return {
		billingCountry: formCountry,
		billingState: formState,
		postCode,
	};
}

export { paymentFailure, paymentWaiting, getBillingCountryAndState };
