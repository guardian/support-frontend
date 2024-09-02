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

// TODO: is there a way of getting the mocked date and adding some months to it (as it likely changes to the mocked date)?


export const Default = Template.bind({});
Default.args = { campaign: 
		{
			label: 'default',
			countdownStartInMillis: Date.parse('Dec 30, 2023 12:10:59'), 
			countdownDeadlineInMillis: Date.parse('Jan 30, 2024 12:10:59'), 
			countdownHideInMillis: Date.parse('Feb 01, 2024 15:06:00'), 
		},
	};

export const DeadlineNear = Template.bind({});
DeadlineNear.args = { campaign: 
		{
			label: 'deadline near',
			countdownStartInMillis: Date.parse('Dec 30, 2023 12:10:59'), 
			countdownDeadlineInMillis: Date.parse('Jan 1, 2024 12:10:59'), 
			countdownHideInMillis: Date.parse('Jan 1, 2024 13:10:59'), 
		},
	};

export const DeadlinePassedHidden = Template.bind({});
DeadlinePassedHidden.args = { campaign: 
		{
			label: 'deadline passed',
			countdownStartInMillis: Date.parse('Aug 29, 2023 15:00:00'), 
			countdownDeadlineInMillis: Date.parse('Aug 29, 2023 15:05:00'), 
			countdownHideInMillis: Date.parse('Aug 29, 2023 15:06:00'), 
		},
	};

export const NotYetAvailableHidden = Template.bind({});
NotYetAvailableHidden.args = { campaign: 
	{
		label: 'start date well in future',
		countdownStartInMillis: Date.parse('Aug 29, 2025 15:00:00'), 
		countdownDeadlineInMillis: Date.parse('Aug 29, 2025 15:05:00'), 
		countdownHideInMillis: Date.parse('Aug 29, 2025 15:06:00'), 
	},
};
