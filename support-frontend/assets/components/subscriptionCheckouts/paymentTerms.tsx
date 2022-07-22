import { FormSection } from 'components/checkoutForm/checkoutForm';
import CancellationPolicy from 'components/subscriptionCheckouts/cancellationPolicy';
import DirectDebitTerms from 'components/subscriptionCheckouts/directDebit/directDebitTerms';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import { DirectDebit } from 'helpers/forms/paymentMethods';
import type { Option } from 'helpers/types/option';

export default function PaymentTerms(props: {
	paymentMethod: Option<PaymentMethod>;
	orderIsAGift?: boolean;
}): JSX.Element {
	return (
		<FormSection>
			{!props.orderIsAGift && <CancellationPolicy />}
			{props.paymentMethod === DirectDebit && <DirectDebitTerms />}
		</FormSection>
	);
}
PaymentTerms.defaultProps = {
	orderIsAGift: false,
};
