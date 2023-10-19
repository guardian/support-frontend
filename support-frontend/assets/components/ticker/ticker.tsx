import './contributionTicker.scss';
import {
	tickerCount,
	tickerGoal,
	tickerLabel,
	tickerLabelContainer,
	tickerMarker,
	tickerProgressBar,
	tickerProgressBarBackground,
	tickerProgressBarFill,
	tickerStatus,
} from './tickerStyles';
import type { TickerCopy, TickerCountType, TickerEndType } from './types';

export type TickerProps = {
	total: number;
	goal: number;
	end: number;
	countType: TickerCountType;
	endType: TickerEndType;
	currencySymbol: string;
	copy: TickerCopy;
};

export type TickerMainLabelProps = {
	goalReached: boolean;
	total: number;
	countType: TickerCountType;
	endType: TickerEndType;
	currencySymbol: string;
	copy: TickerCopy;
};

function percentageToTranslate(total: number, end: number) {
	const percentage = (total / end) * 100 - 100;
	return percentage > 0 ? 0 : percentage;
}

function TickerMainLabel({
	goalReached,
	total,
	countType,
	endType,
	currencySymbol,
	copy,
}: TickerMainLabelProps) {
	if (!goalReached) {
		return (
			<div css={[tickerLabel, tickerStatus]}>
				<div css={tickerCount}>
					{countType === 'money' ? currencySymbol : ''}
					{Math.floor(total).toLocaleString()}&nbsp;
				</div>
				<div>{copy.countLabel}</div>
			</div>
		);
	}

	if (endType === 'unlimited') {
		return (
			<div css={[tickerLabel, tickerStatus]}>
				<div css={tickerCount}>{copy.goalReachedPrimary}&nbsp;</div>
				<div>{copy.goalReachedSecondary}</div>
			</div>
		);
	}

	return (
		<div css={[tickerLabel, tickerStatus]}>
			<div css={tickerCount}>{copy.goalReachedPrimary}&nbsp;</div>
		</div>
	);
}

export function Ticker(props: TickerProps): JSX.Element {
	const progressBarTransform = `translate3d(${percentageToTranslate(
		props.total,
		props.end,
	)}%, 0, 0)`;
	const markerTransform = `translate3d(${
		(props.goal / props.end) * 100 - 100
	}%, -2px, 0)`;

	const goalReached = props.total >= props.goal;

	return (
		<div>
			<div css={tickerLabelContainer}>
				<TickerMainLabel {...props} goalReached={goalReached} />
				<div css={[tickerLabel, tickerGoal]}>
					<div css={tickerCount}>
						{props.countType === 'money' ? props.currencySymbol : ''}
						{Math.floor(props.goal).toLocaleString()}
					</div>
					<div>
						{props.endType === 'unlimited' && goalReached ? (
							props.copy.countLabel
						) : (
							<>&nbsp;goal</>
						)}
					</div>
				</div>
			</div>
			<div css={tickerProgressBar}>
				<div css={tickerProgressBarBackground}>
					<div
						css={tickerProgressBarFill}
						style={{
							transform: progressBarTransform,
						}}
					/>
				</div>
				<div
					css={tickerMarker}
					style={{
						transform: markerTransform,
					}}
				/>
			</div>
		</div>
	);
}
