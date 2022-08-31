import { css } from '@emotion/react';
import { Button, Column, Columns } from '@guardian/source-react-components';
import React, { useState } from 'react';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
import type { PaymentFrequencyTabButtonProps } from 'components/paymentFrequencyTabs/paymentFrequencyTabButton';
import type { PaymentFrequencyTabProps } from 'components/paymentFrequencyTabs/paymentFrequenncyTabs';
import { PaymentFrequencyTabs } from 'components/paymentFrequencyTabs/paymentFrequenncyTabs';
import { withCenterAlignment } from '../../.storybook/decorators/withCenterAlignment';

export default {
	title: 'Checkouts/Payment Frequency Tabs',
	component: PaymentFrequencyTabs,
	argTypes: { onTabChange: { action: 'tab changed' } },
	decorators: [
		(Story: React.FC): JSX.Element => (
			<Columns
				collapseUntil="tablet"
				cssOverrides={css`
					width: 100%;
				`}
			>
				<Column span={[1, 8, 7]}>
					<Box>
						<Story />
					</Box>
				</Column>
			</Columns>
		),
		withCenterAlignment,
	],
	parameters: {
		docs: {
			description: {
				component: `A tab component for switching payment frequency on the checkout. An alternate tab controller component may be supplied.
          The keyboard controls are a simplified version of the ARIA authoring guidelines for a Tabs component, based on research conducted
          by the BBC: https://bbc.github.io/gel/components/tabs/#related-research`,
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
			selected: false,
			content: <BoxContents>Tab 1</BoxContents>,
		},
		{
			id: 'tab2',
			text: 'Tab 2',
			selected: true,
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
	onClick,
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
			onClick={onClick}
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
