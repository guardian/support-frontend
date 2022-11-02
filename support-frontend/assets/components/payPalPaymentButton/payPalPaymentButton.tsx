import AnimatedDots from 'components/spinners/animatedDots';
import { usePayPal } from 'helpers/customHooks/usePayPal';
import { PayPalButton } from './payPalButton';

export function PayPalPaymentButton(): JSX.Element {
	const payPalHasLoaded = usePayPal();

	if (payPalHasLoaded) {
		return <PayPalButton />;
	}
	return <AnimatedDots appearance="dark" />;
}
