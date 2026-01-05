import { Container } from 'components/layout/container';
import { ErrorLabel } from 'components/subscriptionCheckouts/stripeForm/composedStripeElements';
import type { ErrorLabelChildProps } from 'components/subscriptionCheckouts/stripeForm/composedStripeElements';

export default {
	title: 'Checkout Layout/ErrorLabel',
	component: Container,
	decorators: [
		(Story: React.FC): JSX.Element => {
			return (
				<div style={{ padding: '1rem' }}>
					<Story />
				</div>
			);
		},
	],
	parameters: {
		docs: {
			description: {
				component:
					'A slightly modified version of the Container component from Source, to provide the correct internal padding to match Dotcom',
			},
		},
	},
};

function Template({ id, error, label, child }: ErrorLabelChildProps) {
	return <ErrorLabel id={id} error={error} label={label} child={child} />;
}

Template.args = {} as Record<string, unknown>;
export const Default = Template.bind({});
Default.args = {
	id: 'default-error',
	error: 'default error message',
	child: <div>Default Error</div>,
};

export const CardNumberWithError = Template.bind({});
CardNumberWithError.args = {
	id: 'card-number',
	error: 'Invalid card number',
	child: <div>Please re-enter</div>,
};

export const CardExpiryWithError = Template.bind({});
CardExpiryWithError.args = {
	id: 'card-expiry',
	error: 'Invalid card expiry',
	child: <div>Please re-enter</div>,
};

export const CardCvcWithError = Template.bind({});
CardCvcWithError.args = {
	id: 'card-cvc',
	error: 'Invalid card cvc',
	child: <div>Please re-enter</div>,
};

export const RecaptchaWithError = Template.bind({});
RecaptchaWithError.args = {
	id: 'recaptcha',
	error: 'Invalid recaptcha',
	child: <div>Please retry</div>,
};
