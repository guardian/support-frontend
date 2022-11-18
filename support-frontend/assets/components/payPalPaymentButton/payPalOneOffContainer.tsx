import { DefaultPaymentButtonContainer } from 'components/paymentButton/defaultPaymentButtonContainer';
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
	setCheckoutFormHasBeenSubmitted,
} from 'pages/contributions-landing/contributionsLandingActions';

export function PayPalButtonOneOffContainer(): JSX.Element {
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

		dispatch(setCheckoutFormHasBeenSubmitted());
	});

	return (
		<DefaultPaymentButtonContainer
			onClick={payOneOffWithPayPal}
			createButtonText={(amount) => `Pay ${amount} with PayPal`}
		/>
	);
}
