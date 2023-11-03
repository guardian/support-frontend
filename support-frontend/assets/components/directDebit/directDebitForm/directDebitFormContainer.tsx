import { Recaptcha } from 'components/recaptcha/recaptcha';
import {
	setAccountHolderConfirmation,
	setAccountHolderName,
	setAccountNumber,
	setSortCode,
} from 'helpers/redux/checkout/payment/directDebit/actions';
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
		sortCode,
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
		dispatch(setSortCode(newSortCode));
	}

	function updateAccountHolderConfirmation(confirmed: boolean) {
		dispatch(setAccountHolderConfirmation(confirmed));
	}

	function onRecaptchaCompleted(token: string) {
		trackComponentLoad('contributions-recaptcha-client-token-received');
		dispatch(setRecaptchaToken(token));
	}

	return render({
		countryGroupId,
		accountHolderName,
		accountNumber,
		accountHolderConfirmation,
		sortCode,
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
