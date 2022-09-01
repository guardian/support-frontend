import type { PaymentFrequencyTabButtonProps } from 'components/paymentFrequencyTabs/paymentFrequencyTabButton';
import { PaymentFrequencyTabButton } from 'components/paymentFrequencyTabs/paymentFrequencyTabButton';
import { withCenterAlignment } from '../../.storybook/decorators/withCenterAlignment';
import { withSourceReset } from '../../.storybook/decorators/withSourceReset';

export default {
	title: 'Checkouts/Payment Frequency Tab Button',
	component: PaymentFrequencyTabButton,
	argTypes: { onClick: { action: 'tab clicked' } },
	decorators: [withCenterAlignment, withSourceReset],
};

function Template(args: PaymentFrequencyTabButtonProps) {
	return (
		<div>
			<div role="tablist">
				<PaymentFrequencyTabButton {...args} />
			</div>
			<div
				role="tabpanel"
				id={`${args.id}-tab`}
				aria-labelledby={args.id}
			></div>
		</div>
	);
}

Template.args = {} as Record<string, unknown>;

export const Selected = Template.bind({});

Selected.args = {
	role: 'tab',
	id: 'selected',
	ariaSelected: 'true',
	ariaControls: 'selected-tab',
	children: 'Monthly',
};

export const Unselected = Template.bind({});

Unselected.args = {
	role: 'tab',
	id: 'unselected',
	ariaSelected: 'false',
	ariaControls: 'unselected-tab',
	children: 'Monthly',
};
