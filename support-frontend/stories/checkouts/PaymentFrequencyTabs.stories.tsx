import { css } from '@emotion/react';
import { Button, Column, Columns } from '@guardian/source-react-components';
import React, { useState } from 'react';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
import { Container } from 'components/layout/container';
import type { PaymentFrequencyTabButtonProps } from 'components/paymentFrequencyTabs/paymentFrequencyTabButton';
import type { PaymentFrequencyTabProps } from 'components/paymentFrequencyTabs/paymentFrequenncyTabs';
import { PaymentFrequencyTabs } from 'components/paymentFrequencyTabs/paymentFrequenncyTabs';

export default {
	title: 'Checkouts/Payment Frequency Tabs',
	component: PaymentFrequencyTabs,
	argTypes: { onTabChange: { action: 'tab changed' } },
	decorators: [
		(Story: React.FC): JSX.Element => (
			<Container>
				<Columns>
					<Column span={[0, 2, 5]}></Column>
					<Column span={[1, 8, 7]}>
						<Box>
							<Story />
						</Box>
					</Column>
				</Columns>
			</Container>
		),
	],
	parameters: {
		docs: {
			description: {
				component:
					'A tab component for switching payment frequency on the checkout. An alternate tab controller component may be supplied.',
			},
		},
	},
};

function Template(args: PaymentFrequencyTabProps) {
	const [tabList, setTabList] = useState(args.tabs);

	function onTabChange(newTab: string) {
		args.onTabChange(newTab);
		setTabList((oldTabs) =>
			oldTabs.map((tab) => {
				return {
					...tab,
					selected: tab.id === newTab,
				};
			}),
		);
	}

	return (
		<PaymentFrequencyTabs {...args} tabs={tabList} onTabChange={onTabChange} />
	);
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
			content: <BoxContents>Tab 1</BoxContents>,
		},
		{
			id: 'tab2',
			text: 'Tab 2',
			selected: false,
			content: <BoxContents>Tab 2</BoxContents>,
		},
		{
			id: 'tab3',
			text: 'Tab 3',
			selected: false,
			content: <BoxContents>Tab 3</BoxContents>,
		},
	],
};

function AlternativeTabController({
	role,
	id,
	ariaControls,
	ariaSelected,
	onFocus,
	children,
}: PaymentFrequencyTabButtonProps) {
	return (
		<Button
			cssOverrides={css`
				flex-grow: 1;
			`}
			role={role}
			id={id}
			priority={ariaSelected === 'true' ? 'secondary' : 'primary'}
			aria-selected={ariaSelected}
			aria-controls={ariaControls}
			onFocus={onFocus}
		>
			{children}
		</Button>
	);
}

export const WithAlternateController = Template.bind({});

WithAlternateController.args = {
	ariaLabel: 'default',
	TabController: AlternativeTabController,
	tabs: [
		{
			id: 'tab1',
			text: 'Tab 1',
			selected: true,
			content: <BoxContents>Tab 1</BoxContents>,
		},
		{
			id: 'tab2',
			text: 'Tab 2',
			selected: false,
			content: <BoxContents>Tab 2</BoxContents>,
		},
		{
			id: 'tab3',
			text: 'Tab 3',
			selected: false,
			content: <BoxContents>Tab 3</BoxContents>,
		},
	],
};
