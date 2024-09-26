import { css } from '@emotion/react';
import { palette } from '@guardian/source/foundations';
import { useEffect, useState } from 'react';
import type { CountdownSetting } from 'helpers/campaigns/campaigns';
/**
 * This is used during the annual US End of Year Campaign.
 * Beware that this is only accurate to less than a second and is locale specific.
 */

// TODO: colours will change with sub-campaigns and design not yet confirmed...
const outer = css`
	width: 272px;
	margin: auto;
`;

const container = css`
	width: 100%;
	background-color: #1e3e72;
	color: ${palette.neutral[100]};
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
	campaign: CountdownSetting;
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
export default function Countdown({ campaign }: CountdownProps): JSX.Element {
	// one for each timepart to reduce DOM updates where unnecessary.
	const [seconds, setSeconds] = useState<string>(initialTimePart);
	const [minutes, setMinutes] = useState<string>(initialTimePart);
	const [hours, setHours] = useState<string>(initialTimePart);
	const [days, setDays] = useState<string>(initialTimePart);
	const [showCountdown, setShowCountdown] = useState<boolean>(false);

	useEffect(() => {
		const getTotalMillisRemaining = (targetDate: number) => {
			return targetDate - Date.now();
		};
		const canDisplayCountdown = () => {
			const now = Date.now();
			const isActive =
				campaign.countdownStartInMillis < now &&
				campaign.countdownDeadlineInMillis > now;
			setShowCountdown(isActive);
			return isActive;
		};

		function updateTimeParts() {
			const timeRemaining = getTotalMillisRemaining(
				campaign.countdownDeadlineInMillis,
			);

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
			updateTimeParts(); // called first
			const id = setInterval(updateTimeParts, 1000); // run once per second
			// console.log(`The timer has been created.`);
			return () => clearInterval(id); // clear on on unmount
		} else {
			// deadline already passed on page load
			setSeconds(ensureRoundedDoubleDigits(0));
			setMinutes(ensureRoundedDoubleDigits(0));
			setHours(ensureRoundedDoubleDigits(0));
			setDays(ensureRoundedDoubleDigits(0));
		}
	}, [campaign]);

	return (
		<>
			{showCountdown && (
				<div id="timer" role="timer" css={outer}>
					<div css={container}>
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
