import { css } from '@emotion/react';
import { from, palette } from '@guardian/source/foundations';
import { useEffect, useState } from 'react';
import type { CountdownSettings } from '../../../helpers/globalsAndSwitches/landingPageSettings';
import { parseCountdownSettings } from '../../../helpers/globalsAndSwitches/landingPageSettings';

/**
 * This is used during the annual US End of Year Campaign.
 * Beware that this is only accurate to less than a second and is locale specific.
 */

const outer = css`
	width: 272px;
	margin: auto;
	margin-bottom: 16px; // mobile
	margin-top: 0px;
	${from.mobileLandscape} {
		margin-bottom: 24px;
		margin-top: 0px;
	}
`;

const container = (colours?: CountdownSettings) => css`
	width: 100%;
	background-color: ${colours ? colours.theme.backgroundColor : '#1e3e72'};
	color: ${colours ? colours.theme.foregroundColor : palette.neutral[100]};
	padding: 12px 40px;
	border-radius: 8px;

	display: flex;
	flex-direction: row;
	justify-content: space-between;
	text-align: center;
	flex-wrap: nowrap;
`;

const flexItem = css`
	/* 🖥 Text Sans/text.sans.24 */
	font-family: GuardianTextSans;
	font-size: 24px;
	font-style: normal;
	line-height: 130%; /* 31.2px */

	display: flex;
	flex-direction: column;
	justify-content: center;
	text-align: center;
`;

const timePartStyle = css`
	width: 33px;
	flex-grow: 1;
	font-weight: 700;
`;

const colon = css`
	font-size: 12px;
	font-weight: 400px;
	line-height: 135%; /* 16.2px */
	margin: 0 2px;
	margin-bottom: 20px;
`;

const timeLabelStyle = css`
	width: 33px;
	font-size: 12px;
	font-weight: 400px;
	line-height: 135%; /* 16.2px */
	flex-grow: 1;
	align-self: center;
`;

// props
export type CountdownProps = {
	countdownSettings: CountdownSettings;
	setHeadingOverride: (headingOverride: string | undefined) => void;
	setDaysTillDeadline: (countDownDaysLeft: string | undefined) => void;
};

// create countdown logic
const initialTimePart = '00';
const millisecondsInSecond = 1000;
const millisecondsInMinute = 60 * millisecondsInSecond;
const millisecondsInHour = 60 * millisecondsInMinute;
const millisecondsInDay = 24 * millisecondsInHour;

const ensureRoundedDoubleDigits = (timeSection: number): string => {
	return timeSection < 0
		? String(0).padStart(2, '0')
		: String(Math.floor(timeSection)).padStart(2, '0');
};

// return the countdown component
export default function Countdown({
	countdownSettings,
	setHeadingOverride,
	setDaysTillDeadline,
}: CountdownProps): JSX.Element {
	const [canShow, setCanShow] = useState<boolean>(false);
	// one for each timepart to reduce DOM updates where unnecessary.
	const [seconds, setSeconds] = useState<string>(initialTimePart);
	const [minutes, setMinutes] = useState<string>(initialTimePart);
	const [hours, setHours] = useState<string>(initialTimePart);
	const [days, setDays] = useState<string>(initialTimePart);

	const { countdownStartInMillis, countdownDeadlineInMillis } =
		parseCountdownSettings(countdownSettings);

	const hideCountdown = () => {
		setCanShow(false);
		setHeadingOverride(undefined);
	};

	useEffect(() => {
		const getTotalMillisRemaining = (targetDate: number) => {
			return targetDate - Date.now();
		};
		const canDisplayCountdown = () => {
			const now = Date.now();
			return countdownStartInMillis < now && countdownDeadlineInMillis > now;
		};

		function updateTimeParts() {
			const timeRemaining = getTotalMillisRemaining(countdownDeadlineInMillis);
			if (timeRemaining < -1) {
				hideCountdown();
			}
			setDays(
				ensureRoundedDoubleDigits(
					Math.floor(timeRemaining / millisecondsInDay),
				),
			);
			setHours(
				ensureRoundedDoubleDigits(
					(timeRemaining % millisecondsInDay) / millisecondsInHour,
				),
			);
			setMinutes(
				ensureRoundedDoubleDigits(
					(timeRemaining % millisecondsInHour) / millisecondsInMinute,
				),
			);
			setSeconds(
				ensureRoundedDoubleDigits(
					(timeRemaining % millisecondsInMinute) / millisecondsInSecond,
				),
			);
		}

		if (canDisplayCountdown()) {
			setCanShow(true);
			setHeadingOverride(countdownSettings.overwriteHeadingLabel);
			updateTimeParts(); // called first
			const id = setInterval(updateTimeParts, 1000); // run once per second
			return () => clearInterval(id); // clear on on unmount
		} else {
			// deadline already passed on page load
			hideCountdown();
		}

		return;
	}, [countdownSettings]);

	useEffect(() => {
		setDaysTillDeadline(days);
	},[days]);

	return (
		<>
			{canShow && (
				<div id="timer" role="timer" css={outer}>
					<div css={container(countdownSettings)}>
						<TimePart timePart={days} label={'days'} />
						<div css={[flexItem, colon]}>:</div>
						<TimePart timePart={hours} label={'hrs'} />
						<div css={[flexItem, colon]}>:</div>
						<TimePart timePart={minutes} label={'mins'} />
						<div css={[flexItem, colon]}>:</div>
						<TimePart timePart={seconds} label={'secs'} />
					</div>
				</div>
			)}
		</>
	);
}

// internal components

type TimePartProps = {
	timePart: string;
	label: string;
};

function TimePart({ timePart, label }: TimePartProps): JSX.Element {
	return (
		<div css={flexItem}>
			<div css={timePartStyle}>{timePart}</div>
			<div css={timeLabelStyle}>{label}</div>
		</div>
	);
}
