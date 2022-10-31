import { useFormValidation } from 'helpers/customHooks/useFormValidation';
import { DefaultPaymentButtonContainer } from './defaultPaymentButtonContainer';

export function NoPaymentMethodButton(): JSX.Element {
	const onClick = useFormValidation(() => undefined);

	return <DefaultPaymentButtonContainer onClick={onClick} />;
}
