import React from 'react';
import { FormSection } from 'components/checkoutForm/checkoutForm';
import type { Option } from 'helpers/types/option';
import 'helpers/types/option';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import { DirectDebit } from 'helpers/forms/paymentMethods';
import DirectDebitTerms from 'components/subscriptionCheckouts/directDebit/directDebitTerms';
import CancellationPolicy from 'components/subscriptionCheckouts/cancellationPolicy';
export default function PaymentTerms(props: {
	paymentMethod: Option<PaymentMethod>;
	orderIsAGift?: boolean;
}) {
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
