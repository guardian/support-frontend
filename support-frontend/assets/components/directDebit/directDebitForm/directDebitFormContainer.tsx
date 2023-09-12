import { Recaptcha } from 'components/recaptcha/recaptcha';
import {
	setAccountHolderConfirmation,
	setAccountHolderName,
	setAccountNumber,
	setFormError,
	setSortCodeString,
} from 'helpers/redux/checkout/payment/directDebit/actions';
import {
	confirmAccountDetails,
	directDebitErrorMessages,
} from 'helpers/redux/checkout/payment/directDebit/thunks';
import {
	expireRecaptchaToken,
	setRecaptchaToken,
} from 'helpers/redux/checkout/recaptcha/actions';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import { trackComponentLoad } from 'helpers/tracking/behaviour';
import type { DirectDebitFormProps } from './directDebitForm';
import { getDirectDebitFormErrors } from './selectors';

type DirectDebitFormContainerProps = {
	render: (directDebitFormProps: DirectDebitFormProps) => JSX.Element;
};

export function DirectDebitFormContainer({
	render,
}: DirectDebitFormContainerProps): JSX.Element {
	const dispatch = useContributionsDispatch();

	const recaptchaCompleted = useContributionsSelector(
		(state) => state.page.checkoutForm.recaptcha.completed,
	);

	const { countryGroupId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);

	const {
		accountHolderName,
		accountNumber,
		accountHolderConfirmation,
		sortCodeString,
		formError,
	} = useContributionsSelector(
		(state) => state.page.checkoutForm.payment.directDebit,
	);

	const errors = useContributionsSelector(getDirectDebitFormErrors);

	function updateAccountHolderName(newAccountHolderName: string) {
		dispatch(setAccountHolderName(newAccountHolderName));
	}

	function updateAccountNumber(newAccountNumber: string) {
		dispatch(setAccountNumber(newAccountNumber));
	}

	function updateSortCode(newSortCode: string) {
		dispatch(setSortCodeString(newSortCode));
	}

	function updateAccountHolderConfirmation(confirmed: boolean) {
		dispatch(setAccountHolderConfirmation(confirmed));
	}

	// TODO: This functionality should be moving to a payment button in future
	void function onSubmit() {
		void confirmAccountDetails();

		if (recaptchaCompleted) {
			// void dispatch(payWithDirectDebit(props.onPaymentAuthorisation));
		} else {
			dispatch(setFormError(directDebitErrorMessages.notCompletedRecaptcha));
		}
	};

	function onRecaptchaCompleted(token: string) {
		trackComponentLoad('contributions-recaptcha-client-token-received');
		dispatch(setRecaptchaToken(token));
	}

	return render({
		countryGroupId,
		accountHolderName,
		accountNumber,
		accountHolderConfirmation,
		sortCode: sortCodeString,
		recaptchaCompleted,
		updateAccountHolderName,
		updateAccountNumber,
		updateSortCode,
		updateAccountHolderConfirmation,
		formError,
		errors,
		recaptcha: (
			<Recaptcha
				onRecaptchaCompleted={onRecaptchaCompleted}
				onRecaptchaExpired={() => dispatch(expireRecaptchaToken())}
			/>
		),
	});
}
