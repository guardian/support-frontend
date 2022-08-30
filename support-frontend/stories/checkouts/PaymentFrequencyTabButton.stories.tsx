import type { PaymentFrequencyTabButtonProps } from 'components/paymentFrequencyTabs/paymentFrequencyTabButton';
import { PaymentFrequencyTabButton } from 'components/paymentFrequencyTabs/paymentFrequencyTabButton';
import { withCenterAlignment } from '../../.storybook/decorators/withCenterAlignment';

export default {
	title: 'Checkouts/Payment Frequency Tab Button',
	component: PaymentFrequencyTabButton,
	argTypes: { onClick: { action: 'tab clicked' } },
	decorators: [withCenterAlignment],
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
	id: 'selected',
	isSelected: true,
	children: 'Monthly',
};

export const NotSelected = Template.bind({});

NotSelected.args = {
	id: 'not-selected',
	isSelected: false,
	children: 'Monthly',
};
