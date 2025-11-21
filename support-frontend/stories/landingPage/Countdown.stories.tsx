import { css } from '@emotion/react';
import { palette } from '@guardian/source/foundations';
import type { CountdownProps } from 'pages/supporter-plus-landing/components/countdown';
import Countdown from 'pages/supporter-plus-landing/components/countdown';

export default {
	title: 'LandingPage/Countdown',
	component: Countdown,
	parameters: {
		docs: {
			description: {
				component: `A countdown component for use in campaigns, particularly for example, the US end of year. NOTE: that the versions are fixed against the mocked current date set in Storybook and do not actually count down in Storybook.`,
			},
		},
	},
};

const millisecondsInSecond = 1000;
const millisecondsInMinute = 60 * millisecondsInSecond;
const millisecondsInHour = 60 * millisecondsInMinute;
const millisecondsInDay = 24 * millisecondsInHour;

const buildTimestamp = (date: number): string =>
	//remove the timezone
	new Date(date).toISOString().slice(0, -1);

function Template(args: CountdownProps) {
	const contentContainer = css`
		height: 500px;
		width: 100%;
		padding-top: 40px;
		background: ${palette.brand[400]};
	`;
	return (
		<div css={contentContainer}>
			<Countdown {...args} />
		</div>
	);
}

Template.args = {} as CountdownProps;

export const Default = Template.bind({});
Default.args = {
	countdownSettings: {
    overwriteHeadingLabel: 'default',
    countdownStartTimestamp: buildTimestamp(Date.now()- 1 * millisecondsInDay + 1 * millisecondsInHour),
    countdownDeadlineTimestamp: buildTimestamp(Date.now() +
   (2 * millisecondsInDay +
    1 * millisecondsInHour +
    45 * millisecondsInMinute +
    30 * millisecondsInSecond)),
    useLocalTime: true,
		theme: {
			backgroundColor: '#1e3e72',
			foregroundColor: '#ffffff',
		},
	},
	setHeadingOverride: () => {},
	setDaysTillDeadline: () => {},
};

export const DeadlineNear = Template.bind({});
DeadlineNear.args = {
	countdownSettings: {
		overwriteHeadingLabel: 'deadline near',
		countdownStartTimestamp: buildTimestamp(Date.now() - 1 * millisecondsInDay),
		countdownDeadlineTimestamp: buildTimestamp(
			Date.now() + 5 * millisecondsInSecond,
		),
		useLocalTime: true,
		theme: {
			backgroundColor: '#1e3e72',
			foregroundColor: '#ffffff',
		},
	},
	setHeadingOverride: () => {},
	setDaysTillDeadline: () => {},
};

export const DeadlinePassedHidden = Template.bind({});
DeadlinePassedHidden.args = {
	countdownSettings: {
		overwriteHeadingLabel: 'deadline passed',
		countdownStartTimestamp: buildTimestamp(Date.now() - 1 * millisecondsInDay),
		countdownDeadlineTimestamp: buildTimestamp(
			Date.now() - 5 * millisecondsInSecond,
		),
		useLocalTime: true,
		theme: {
			backgroundColor: '#1e3e72',
			foregroundColor: '#ffffff',
		},
	},
	setHeadingOverride: () => {},
	setDaysTillDeadline: () => {},
};

export const NotYetAvailableHidden = Template.bind({});
NotYetAvailableHidden.args = {
	countdownSettings: {
		overwriteHeadingLabel: 'start date well in future',
		countdownStartTimestamp: buildTimestamp(Date.now() + 1 * millisecondsInDay),
		countdownDeadlineTimestamp: buildTimestamp(
			Date.now() + 5 * millisecondsInDay,
		),
		useLocalTime: true,
		theme: {
			backgroundColor: '#1e3e72',
			foregroundColor: '#ffffff',
		},
	},
	setHeadingOverride: () => {},
	setDaysTillDeadline: () => {},
};

export const ThemedSubCampaign = Template.bind({});
ThemedSubCampaign.args = {
	countdownSettings: {
		overwriteHeadingLabel: 'change colour theme',
		countdownStartTimestamp: buildTimestamp(
			Date.now() - 1 * millisecondsInDay + 1 * millisecondsInHour,
		),
		countdownDeadlineTimestamp: buildTimestamp(
			Date.now() +
				(2 * millisecondsInDay +
					1 * millisecondsInHour +
					45 * millisecondsInMinute +
					30 * millisecondsInSecond),
		),
		useLocalTime: true,
		theme: {
			backgroundColor: '#ab0613',
			foregroundColor: '#ffffff',
		},
	},
	setHeadingOverride: () => {},
	setDaysTillDeadline: () => {},
};
