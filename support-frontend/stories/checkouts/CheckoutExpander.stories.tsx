import CheckoutExpanderComponent from 'components/checkoutExpander/checkoutExpander';

export default {
	title: 'Checkouts/Checkout Expander',
	component: CheckoutExpanderComponent,
	decorators: [(Story: React.FC): JSX.Element => <Story />],
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
