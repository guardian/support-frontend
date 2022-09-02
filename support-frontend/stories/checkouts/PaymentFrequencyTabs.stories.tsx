import { css } from '@emotion/react';
import { Button, Column, Columns } from '@guardian/source-react-components';
import React, { useState } from 'react';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
import type { PaymentFrequencyTabButtonProps } from 'components/paymentFrequencyTabs/paymentFrequencyTabButton';
import type { PaymentFrequencyTabsProps } from 'components/paymentFrequencyTabs/paymentFrequenncyTabs';
import { PaymentFrequencyTabs } from 'components/paymentFrequencyTabs/paymentFrequenncyTabs';
import type { ContributionType } from 'helpers/contributions';
import { withCenterAlignment } from '../../.storybook/decorators/withCenterAlignment';
import { withSourceReset } from '../../.storybook/decorators/withSourceReset';

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
		withSourceReset,
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

function Template(args: PaymentFrequencyTabsProps) {
	const [selectedTab, setSelectedTab] = useState(
		args.tabs.find((tab) => tab.selected)?.id ?? args.tabs[0].id,
	);
	const [tabList, setTabList] = useState(args.tabs);

	function onTabChange(newTab: ContributionType) {
		args.onTabChange(newTab);
		setSelectedTab(newTab);
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
		<PaymentFrequencyTabs
			{...args}
			tabs={tabList}
			selectedTab={selectedTab}
			onTabChange={onTabChange}
			renderTabContent={(tabId) => (
				<BoxContents>{`${tabId} tab content`}</BoxContents>
			)}
		/>
	);
}

Template.args = {} as Record<string, unknown>;

export const Default = Template.bind({});

Default.args = {
	ariaLabel: 'default',
	tabs: [
		{
			id: 'ONE_OFF',
			labelText: 'Single',
			selected: false,
		},
		{
			id: 'MONTHLY',
			labelText: 'Monthly',
			selected: true,
		},
		{
			id: 'ANNUAL',
			labelText: 'Annual',
			selected: false,
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
			labelText: 'Tab 1',
			selected: true,
		},
		{
			id: 'tab2',
			labelText: 'Tab 2',
			selected: false,
		},
		{
			id: 'tab3',
			labelText: 'Tab 3',
			selected: false,
		},
	],
};
