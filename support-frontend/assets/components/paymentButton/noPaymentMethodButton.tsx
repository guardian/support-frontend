import { validateForm } from 'helpers/redux/checkout/checkoutActions';
import { useContributionsDispatch } from 'helpers/redux/storeHooks';
import { DefaultPaymentButtonContainer } from './defaultPaymentButtonContainer';

export function NoPaymentMethodButton(): JSX.Element {
	const dispatch = useContributionsDispatch();

	return (
		<DefaultPaymentButtonContainer onClick={() => dispatch(validateForm())} />
	);
}
