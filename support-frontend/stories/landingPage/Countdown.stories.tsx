import { css } from "@emotion/react";
import { palette } from "@guardian/source/foundations";
import type { CountdownProps } from "pages/supporter-plus-landing/components/countdown";
import Countdown from "pages/supporter-plus-landing/components/countdown";

export default {
    title: 'LandingPage/Countdown',
    component: Countdown,
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

export const Default = Template.bind({});
Default.args = {deadlineDateTime: Date.parse('Nov 26, 2024 23:59:59')};

export const DeadlinePassed = Template.bind({});
DeadlinePassed.args = {deadlineDateTime: Date.parse('Aug 26, 2024 23:59:59')};
