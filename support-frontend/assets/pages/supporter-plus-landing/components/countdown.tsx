import { css } from '@emotion/react';
import { headlineBold28, palette } from '@guardian/source/foundations';
import { useEffect, useState } from 'react';
import type { CountdownSetting } from 'helpers/campaigns/campaigns';
/**
 * This is used during the annual US End of Year Campaign.
 */

// create the style - TODO: design not yet confirmed...
const gridStyle = css`
	display: flex;
	padding-top: 33px;
	padding-bottom: 15px;
	justify-content: center;
	align-items: center;
`;
const gridItemStyle = css`
	font-variant-numeric: lining-nums proportional-nums;
	color: ${palette.brand[400]};
	background-color: ${palette.neutral[100]};
	/* 🖥 Headline/headline.bld.28 */
	${headlineBold28}
	/* font-family: 'headlineBold28';
    font-size: 28px;
    font-style: normal;
    font-weight: 700; 
    line-height: 115%;*/ /* 32.2px */
    width: 65px;
	margin: 3px;
	padding: 2px;
	border: 1px solid ${palette.brand[400]};
	border-radius: 4px;
	text-align: center;
`;
const timePortionStyle = css`
	color: ${palette.brand[400]};
	/* 🖥 Text Sans/text.sans.12 */
	font-family: 'GuardianTextSans';
	font-size: 12px;
	font-style: normal;
	font-weight: 400;
	line-height: 130%; /* 15.6px */
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
				<div role="timer" css={gridStyle}>
					<TimePart timePart={days} label={'days'} />
					<TimePart timePart={hours} label={'hours'} />
					<TimePart timePart={minutes} label={'mins'} />
					<TimePart timePart={seconds} label={'secs'} />
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
		<div css={gridItemStyle}>
			<div>{timePart}</div>
			<div css={timePortionStyle}>{label}</div>
		</div>
	);
}
