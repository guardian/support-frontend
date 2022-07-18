import React from 'react';
import type { TickerSettings } from 'components/ticker/contributionTicker';
import ContributionTicker from 'components/ticker/contributionTicker';
import { withCenterAlignment } from '../../.storybook/decorators/withCenterAlignment';

export default {
	title: 'Checkouts/Contribution Ticker',
	component: ContributionTicker,
	argTypes: {
		appearance: {
			control: {
				type: 'radio',
				options: ['light', 'dark'],
			},
		},
		onGoalReached: { action: 'goal reached' },
	},
	decorators: [
		(Story: React.FC): JSX.Element => (
			<div
				style={{
					width: '100%',
					maxWidth: '500px',
				}}
			>
				<Story />
			</div>
		),
		withCenterAlignment,
	],
};

function Template(
	args: TickerSettings & {
		onGoalReached: () => void;
	},
) {
	return (
		<ContributionTicker
			tickerCountType={args.tickerCountType}
			onGoalReached={args.onGoalReached}
			tickerEndType={args.tickerEndType}
			currencySymbol={args.currencySymbol}
			copy={args.copy}
		/>
	);
}

Template.args = {} as Record<string, unknown>;

export const PeopleTicker = Template.bind({});

PeopleTicker.args = {
	tickerCountType: 'people',
	tickerEndType: 'unlimited',
	currencySymbol: '£',
	copy: {
		countLabel: 'supporters in Australia',
		goalReachedPrimary: "We've hit our goal!",
		goalReachedSecondary: 'but you can still support us',
	},
};

export const MoneyTicker = Template.bind({});

MoneyTicker.args = {
	tickerCountType: 'money',
	tickerEndType: 'hardstop',
	currencySymbol: '$',
	copy: {
		countLabel: 'raised',
		goalReachedPrimary: "We've hit our goal!",
		goalReachedSecondary: 'but you can still support us',
	},
};
