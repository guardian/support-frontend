import type { OtherAmountProps } from 'components/otherAmount/otherAmount';
import { OtherAmount } from 'components/otherAmount/otherAmount';
import { withCenterAlignment } from '../../.storybook/decorators/withCenterAlignment';
import { withSourceReset } from '../../.storybook/decorators/withSourceReset';

export default {
	title: 'Checkouts/Other Amount',
	component: OtherAmount,
	argTypes: {
		onOtherAmountChange: { action: 'value changed' },
	},
	decorators: [withCenterAlignment, withSourceReset],
	parameters: {
		docs: {
			description: {
				component:
					'The currency glyph will be displayed in either the prefix or suffix of the input depending on the currency localisation',
			},
		},
	},
};

function Template(args: OtherAmountProps) {
	return <OtherAmount {...args} />;
}

Template.args = {} as Omit<OtherAmountProps, 'onOtherAmountChange'>;

export const Default = Template.bind({});

Default.args = {
	selectedAmount: 'other',
	otherAmount: '',
	currency: 'GBP',
	minAmount: 2,
};

export const WithSuffix = Template.bind({});

WithSuffix.args = {
	selectedAmount: 'other',
	otherAmount: '',
	currency: 'SEK',
	minAmount: 10,
};
