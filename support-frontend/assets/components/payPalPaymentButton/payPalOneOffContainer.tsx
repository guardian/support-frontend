import type { PaymentButtonComponentProps } from 'components/paymentButton/paymentButtonController';
import { useFormValidation } from 'helpers/customHooks/useFormValidation';
import { getUserSelectedAmount } from 'helpers/redux/checkout/product/selectors/selectedAmount';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import { payPalCancelUrl, payPalReturnUrl } from 'helpers/urls/routes';
import {
	createOneOffPayPalPayment,
	paymentWaiting,
} from 'pages/supporter-plus-landing/setup/legacyActionCreators';

export function PayPalButtonOneOffContainer({
	DefaultButtonContainer,
}: PaymentButtonComponentProps): JSX.Element {
	const dispatch = useContributionsDispatch();
	const { currencyId, countryGroupId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);
	const amount = useContributionsSelector(getUserSelectedAmount);
	const { email } = useContributionsSelector(
		(state) => state.page.checkoutForm.personalDetails,
	);

	const payOneOffWithPayPal = useFormValidation(function oneOffPaypalPayment() {
		dispatch(paymentWaiting(true));

		dispatch(
			createOneOffPayPalPayment({
				currency: currencyId,
				amount,
				returnURL: payPalReturnUrl(countryGroupId, email),
				cancelURL: payPalCancelUrl(countryGroupId),
			}),
		);
	});

	return (
		<DefaultButtonContainer
			onClick={payOneOffWithPayPal}
			createButtonText={(amount) => `Pay ${amount} with PayPal`}
		/>
	);
}
