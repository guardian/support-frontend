import React from 'react';
import type { TickerProps } from 'components/ticker/ticker';
import { Ticker } from 'components/ticker/ticker';
import { withCenterAlignment } from '../../.storybook/decorators/withCenterAlignment';

export default {
	title: 'Checkouts/Ticker',
	component: Ticker,
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

function Template(args: TickerProps) {
	return <Ticker {...args} />;
}

Template.args = {} as TickerProps;

export const PeopleTicker = Template.bind({});

PeopleTicker.args = {
	total: 200000,
	goal: 200000,
	end: 250000,
	countType: 'people',
	endType: 'unlimited',
	countryGroupId: 'AUDCountries',
	headline: 'End of year campaign',
};

export const MoneyTicker = Template.bind({});

MoneyTicker.args = {
	total: 50000,
	goal: 200000,
	end: 230000,
	countType: 'money',
	endType: 'hardstop',
	countryGroupId: 'UnitedStates',
	headline: 'End of year campaign',
};
