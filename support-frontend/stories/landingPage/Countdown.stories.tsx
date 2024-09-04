import { css } from "@emotion/react";
import { palette } from "@guardian/source/foundations";
import type { CountdownProps } from "pages/supporter-plus-landing/components/countdown";
import Countdown from "pages/supporter-plus-landing/components/countdown";

export default {
    title: 'LandingPage/Countdown',
    component: Countdown,
    parameters: {
		docs: {
			description: {
				component: `A countdown component for use in campaigns, particularly for example, the US end of year. Note that the current date set in Storybook is 01-01-2024 so that will affect the countdown values.`,
			},
		},
	},
};

const millisecondsInSecond = 1000;
const millisecondsInMinute = 60 * millisecondsInSecond;
const millisecondsInHour = 60 * millisecondsInMinute;
const millisecondsInDay = 24 * millisecondsInHour;

function Template(args: CountdownProps) {
	const innerContentContainer = css`
		margin: 0 auto;
		background-color: ${palette.brand[400]};
	`;
	return (
		<div css={innerContentContainer} >
            <Countdown {...args} />
        </div>
    );
};

Template.args = {} as CountdownProps;

export const Default = Template.bind({});
Default.args = { campaign: 
	{
		label: 'default',
		countdownStartInMillis: (Date.now() - (1 * millisecondsInDay) + (1 * millisecondsInHour)),
		countdownDeadlineInMillis: (Date.now() + ((2 * millisecondsInDay) + (1 * millisecondsInHour) + (45 * millisecondsInMinute) + (30 * millisecondsInSecond))),
		countdownHideInMillis: (Date.now() + (6 * millisecondsInDay))
	}
};

export const DeadlineNear = Template.bind({});
DeadlineNear.args = { campaign: 
	{
		label: 'deadline near',
		countdownStartInMillis: (Date.now() - (1 * millisecondsInDay)),
		countdownDeadlineInMillis: (Date.now() + (5 * millisecondsInSecond)),
		countdownHideInMillis: (Date.now() + (6 * millisecondsInSecond)), 
	}
};

export const DeadlinePassedHidden = Template.bind({});
DeadlinePassedHidden.args = { campaign: 
	{
		label: 'deadline passed',
		countdownStartInMillis: (Date.now() - (1 * millisecondsInDay)),
		countdownDeadlineInMillis: (Date.now() - (5 * millisecondsInSecond)),
		countdownHideInMillis: (Date.now() - (4 * millisecondsInSecond)),
	}
};

export const NotYetAvailableHidden = Template.bind({});
NotYetAvailableHidden.args = { campaign: 
	{
		label: 'start date well in future',
		countdownStartInMillis: (Date.now() + (1 * millisecondsInDay)),
		countdownDeadlineInMillis: (Date.now() + (5 * millisecondsInDay)),
		countdownHideInMillis: (Date.now() + (4 * millisecondsInDay)),
	}
};
