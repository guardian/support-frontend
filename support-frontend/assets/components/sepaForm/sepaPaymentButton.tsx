import { DefaultPaymentButtonContainer } from 'components/paymentButton/defaultPaymentButtonContainer';
import { useFormValidation } from 'helpers/customHooks/useFormValidation';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import { onThirdPartyPaymentAuthorised } from 'pages/contributions-landing/contributionsLandingActions';

export function SepaPaymentButton(): JSX.Element {
	const dispatch = useContributionsDispatch();
	const { accountHolderName, iban, country, streetName } =
		useContributionsSelector((state) => state.page.checkoutForm.payment.sepa);

	const payWithSepa = useFormValidation(function payWithSepa() {
		void dispatch(
			onThirdPartyPaymentAuthorised({
				paymentMethod: 'Sepa',
				accountHolderName,
				iban,
				country,
				streetName,
			}),
		);
	});

	return <DefaultPaymentButtonContainer onClick={payWithSepa} />;
}
