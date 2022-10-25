import type { DefaultPaymentButtonProps } from 'components/paymentButton/defaultPaymentButton';
import { DefaultPaymentButton } from 'components/paymentButton/defaultPaymentButton';
import { withCenterAlignment } from '../../.storybook/decorators/withCenterAlignment';
import { withSourceReset } from '../../.storybook/decorators/withSourceReset';

export default {
	title: 'Checkouts/Default Payment Button',
	component: DefaultPaymentButton,
	argTypes: {
		onClick: { action: 'click' },
	},
	decorators: [withCenterAlignment, withSourceReset],
};

function Template(args: DefaultPaymentButtonProps) {
	return <DefaultPaymentButton {...args} />;
}

Template.args = {} as Omit<DefaultPaymentButtonProps, 'onClick'>;

export const Default = Template.bind({});

Default.args = {
	amountWithCurrency: '£12',
	paymentInterval: 'month',
};
