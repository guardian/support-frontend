import { useFormValidation } from 'helpers/customHooks/useFormValidation';
import type { PaymentButtonComponentProps } from './paymentButtonController';

export function NoPaymentMethodButton({
	DefaultButtonContainer,
}: PaymentButtonComponentProps): JSX.Element {
	const onClick = useFormValidation(() => undefined);

	return <DefaultButtonContainer onClick={onClick} />;
}
