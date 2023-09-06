import {
	setAccountHolderConfirmation,
	setAccountHolderName,
	setAccountNumber,
	// setDDGuaranteeClose,
	// setDDGuaranteeOpen,
	setSortCodeString,
} from 'helpers/redux/checkout/payment/directDebit/actions';
import type { DirectDebitState } from 'helpers/redux/checkout/payment/directDebit/state';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';

type DirectDebitFormProps = {
	accountHolderName: string;
	accountNumber: string;
	accountHolderConfirmation: boolean;
	sortCode: string;
	updateAccountHolderName: (name: string) => void;
	updateAccountNumber: (number: string) => void;
	updateSortCode: (sortCode: string) => void;
	updateAccountHolderConfirmation: (confirmation: boolean) => void;
	errors: DirectDebitState['errors'];
};

type DirectDebitFormContainerProps = {
	render: (directDebitFormProps: DirectDebitFormProps) => JSX.Element;
};

export function DirectDebitFormContainer({
	render,
}: DirectDebitFormContainerProps): JSX.Element {
	const dispatch = useContributionsDispatch();

	const {
		accountHolderName,
		accountNumber,
		accountHolderConfirmation,
		sortCodeString,
		errors,
	} = useContributionsSelector(
		(state) => state.page.checkoutForm.payment.directDebit,
	);

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

	return render({
		accountHolderName,
		accountNumber,
		accountHolderConfirmation,
		sortCode: sortCodeString,
		updateAccountHolderName,
		updateAccountNumber,
		updateSortCode,
		updateAccountHolderConfirmation,
		errors,
	});
}
