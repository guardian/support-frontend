import { Column, Columns } from '@guardian/source-react-components';
import React from 'react';
import { Box } from 'components/checkoutBox/checkoutBox';
import { Container } from 'components/layout/container';
import type { PaymentFrequencyTabProps } from 'components/paymentFrequencyTabs/paymentFrequenncyTabs';
import { PaymentFrequencyTabs } from 'components/paymentFrequencyTabs/paymentFrequenncyTabs';
import { withCenterAlignment } from '../../.storybook/decorators/withCenterAlignment';

export default {
	title: 'Checkouts/Payment Frequency Tabs',
	component: PaymentFrequencyTabs,
	argTypes: { onTabChange: { action: 'tab changed' } },
	decorators: [
		(Story: React.FC): JSX.Element => (
			<Container>
				<Columns>
					<Column span={5}></Column>
					<Column span={7}>
						<Box>
							<Story />
						</Box>
					</Column>
				</Columns>
			</Container>
		),
		withCenterAlignment,
	],
};

function Template(args: PaymentFrequencyTabProps) {
	return <PaymentFrequencyTabs {...args} />;
}

Template.args = {} as Record<string, unknown>;

export const Default = Template.bind({});

Default.args = {
	ariaLabel: 'default',
	tabs: [
		{
			id: 'tab1',
			text: 'Tab 1',
			selected: true,
			content: 'Tab 1',
		},
		{
			id: 'tab2',
			text: 'Tab 2',
			selected: false,
			content: 'Tab 2',
		},
		{
			id: 'tab3',
			text: 'Tab 3',
			selected: false,
			content: 'Tab 3',
		},
	],
};
