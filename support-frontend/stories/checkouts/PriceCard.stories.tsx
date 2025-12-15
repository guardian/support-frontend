import type { PriceCardProps } from 'components/priceCards/priceCard';
import { PriceCard } from 'components/priceCards/priceCard';
import { withCenterAlignment } from '../../.storybook/decorators/withCenterAlignment';
import { withSourceReset } from '../../.storybook/decorators/withSourceReset';

export default {
	title: 'Checkouts/Price Card',
	component: PriceCard,
	argTypes: {
		onClick: { action: 'card clicked' },
		paymentInterval: { control: { type: 'radio', options: ['month', 'year'] } },
	},
	decorators: [withCenterAlignment, withSourceReset],
};

function Template(args: PriceCardProps) {
	return <PriceCard {...args} />;
}

Template.args = {} as Omit<PriceCardProps, 'onClick'>;

export const WithFrequency = Template.bind({});

WithFrequency.args = {
	amount: 10,
	label: '£10 per month',
	isSelected: true,
};

export const WithoutFrequency = Template.bind({});

WithoutFrequency.args = {
	amount: 20,
	label: '$20',
	isSelected: false,
};
