import { css } from '@emotion/react';
import { palette } from '@guardian/source/foundations';
import { useEffect, useState } from 'react';
import type { CountdownSetting } from 'helpers/campaigns/campaigns';
/**
 * This is used during the annual US End of Year Campaign.
 */

// create the style - TODO: design not yet confirmed...
const gridStyle = css`
	display: flex;
	justify-content: center;
	align-items: center; 
	margin: auto;
	width: 400px;
	/* width: 272px; */
	height: 69px;
	padding: 12px 40px;
	flex-shrink: 0;
	background-color: #fff; /* debugging*/
	/* background-color: #1E3E72; */
	border-radius: 8px;
	color: ${palette.sport[100]}; /* debugging */
	/* color: ${palette.neutral[100]}; */
	/* debugging */
	border: 1px dotted black;
	padding: 1px;
`;

const gridItemStyle = css`
	/* font-variant-numeric: lining-nums proportional-nums; */
	justify-content: center;
	
	/* 🖥 Text Sans/text.sans.24 */
	font-family: GuardianTextSans;
	font-size: 24px;
	font-style: normal;
	font-weight: 700;
	line-height: 130%; /* 31.2px */

    width: 100px;
    /* width: 65px; */
	text-align: center;

	/* debugging */
	border: 1px dotted red;
	padding: 2px;
`;

const timePartStyle = css`
	display: flex;
	justify-content: center;
	align-items: center; 
	flex-shrink: 0;
	/* debugging */
	border: 1px dotted green;
	padding: 2px;
`;

const timepartcss = css`

	/* debugging */
	border: 1px dotted turquoise;
	padding: 2px;	
`

const colonStyle = css`
	font-size: 12px;
	color: #ee1212;
	/* debugging */
	border: 1px dotted blue;
	padding: 2px;
`;

const timeLabelStyle = css`
	font-size: 12px;
	/* debugging */
	border: 1px dotted purple;
	padding: 2px;
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
				<div id="timer" role="timer" css={gridStyle}>
					<TimePart timePart={days} colon={':'} label={'days'} />
					<TimePart timePart={hours} colon={':'} label={'hrs'} />
					<TimePart timePart={minutes} colon={':'} label={'mins'} />
					<TimePart timePart={seconds} label={'secs'} />
				</div>
			)}
		</>
	);
}

// internal components

type TimePartProps = {
	timePart: string;
	colon?: string;
	label: string;
};

function TimePart({ timePart, colon, label }: TimePartProps): JSX.Element {
	return (
		<div id="gridItem" css={gridItemStyle}>
			<div id="timepart-container" css={timePartStyle}>
				<div css={timepartcss} id="timepart">{timePart}</div>
				{colon ? <div id="colon" css={colonStyle}>{colon}</div> : <div css={colonStyle}>&nbsp;</div>}
			</div>
			<div id="label" css={timeLabelStyle}>{label}</div><div css={colonStyle}>&nbsp;</div>
		</div>
	);
}
