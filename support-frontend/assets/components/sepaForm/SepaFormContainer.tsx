import {
	setSepaAccountHolderName,
	setSepaAddressCountry,
	setSepaAddressStreetName,
	setSepaIban,
} from 'helpers/redux/checkout/payment/sepa/actions';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import type { SepaFormProps } from './SepaForm';

type SepaFormContainerProps = {
	render: (sepaFormProps: SepaFormProps) => JSX.Element;
};

export function SepaFormContainer({
	render,
}: SepaFormContainerProps): JSX.Element {
	const dispatch = useContributionsDispatch();

	const { iban, accountHolderName, streetName, country, errors } =
		useContributionsSelector((state) => state.page.checkoutForm.payment.sepa);

	function updateIban(iban: string) {
		dispatch(setSepaIban(iban));
	}

	function updateAccountHolderName(accountHolderName: string) {
		dispatch(setSepaAccountHolderName(accountHolderName));
	}

	function updateAddressStreetName(addressStreetName: string) {
		dispatch(setSepaAddressStreetName(addressStreetName));
	}

	function updateAddressCountry(addressCountry: string) {
		dispatch(setSepaAddressCountry(addressCountry));
	}

	return render({
		iban,
		accountHolderName,
		addressStreetName: streetName,
		addressCountry: country,
		updateIban,
		updateAccountHolderName,
		updateAddressStreetName,
		updateAddressCountry,
		errors,
	});
}
