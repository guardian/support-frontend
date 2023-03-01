import type { PaymentButtonComponentProps } from 'components/paymentButton/paymentButtonController';
import { useFormValidation } from 'helpers/customHooks/useFormValidation';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import { onThirdPartyPaymentAuthorised } from 'pages/supporter-plus-landing/setup/legacyActionCreators';

export function SepaPaymentButton({
	DefaultButtonContainer,
}: PaymentButtonComponentProps): JSX.Element {
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

	return <DefaultButtonContainer onClick={payWithSepa} />;
}
