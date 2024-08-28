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

// is there a way of getting the mocked date and adding some months to it (as it likely changes)?
const deadlineFar = 'Mar 26, 2024 23:59:59'; 
const deadlineNear = 'Jan 1, 2024 12:10:59';
const deadlinePassed = 'Aug 26, 2023 23:59:59';

export const Default = Template.bind({});
Default.args = {deadlineDateTime: Date.parse(deadlineFar)};

export const DeadlineNear = Template.bind({});
DeadlineNear.args = {deadlineDateTime: Date.parse(deadlineNear)};

export const DeadlinePassed = Template.bind({});
DeadlinePassed.args = {deadlineDateTime: Date.parse(deadlinePassed)};
