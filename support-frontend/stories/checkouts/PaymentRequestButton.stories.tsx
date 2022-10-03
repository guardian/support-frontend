import type { PaymentRequestButtonProps } from 'components/paymentRequestButton/paymentRequestButton';
import { PaymentRequestButton } from 'components/paymentRequestButton/paymentRequestButton';
import { withCenterAlignment } from '../../.storybook/decorators/withCenterAlignment';
import { withSourceReset } from '../../.storybook/decorators/withSourceReset';
import { Default as SavedCardButton } from './SavedCardButton.stories';

export default {
	title: 'Checkouts/Payment Request Button',
	component: PaymentRequestButton,
	decorators: [withCenterAlignment, withSourceReset],
};

function Template(args: PaymentRequestButtonProps) {
	return <PaymentRequestButton {...args} />;
}

Template.args = {} as Record<string, unknown>;

export const Default = Template.bind({});

Default.args = {
	button: <SavedCardButton onClick={() => undefined} />,
};

export const NoButton = Template.bind({});
