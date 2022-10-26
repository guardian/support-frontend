import { DefaultPaymentButtonContainer } from 'components/paymentButton/defaultPaymentButtonContainer';

export function AmazonPaymentButton(): JSX.Element {
	return (
		<DefaultPaymentButtonContainer
			onClick={() => {
				console.log('AmazonPaymentButtonPress');
			}}
		/>
	);
}
