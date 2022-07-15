import CheckoutExpanderComponent from 'components/checkoutExpander/checkoutExpander';
import { FormSection } from 'components/checkoutForm/checkoutForm';

export default {
	title: 'Checkouts/Checkout Expander',
	component: CheckoutExpanderComponent,
	decorators: [
		(Story: React.FC): JSX.Element => (
			<FormSection>
				<Story />
			</FormSection>
		),
	],
};

export function CheckoutExpander(args: { copy: string }): JSX.Element {
	return (
		<CheckoutExpanderComponent copy={args.copy}>
			<p>For some additional information</p>
		</CheckoutExpanderComponent>
	);
}

CheckoutExpander.args = {
	copy: 'Expand this',
};
