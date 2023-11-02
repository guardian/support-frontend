import {
	tickerHeadline,
	tickerLabel,
	tickerLabelContainer,
	tickerLabelTotal,
	tickerProgressBar,
	tickerProgressBarBackground,
	tickerProgressBarFill,
} from './tickerStyles';
import type { TickerCountType, TickerEndType } from './types';

export type TickerProps = {
	total: number;
	goal: number;
	end: number;
	countType: TickerCountType;
	endType: TickerEndType;
	currencySymbol: string;
	headline: string;
};

type TickerLabelProps = {
	total: number;
	goal: number;
	countType: TickerCountType;
	currencySymbol: string;
};

function progressBarTranslation(total: number, end: number) {
	const percentage = (total / end) * 100 - 100;
	return percentage > 0 ? 0 : percentage;
}

function TickerLabel(props: TickerLabelProps) {
	if (props.countType === 'people') {
		return (
			<div css={tickerLabelContainer}>
				<p css={tickerLabel}>
					<span css={tickerLabelTotal}>{props.total} supporters</span> of{' '}
					{props.goal} goal
				</p>
			</div>
		);
	}
	return (
		<div css={tickerLabelContainer}>
			<p css={tickerLabel}>
				<span css={tickerLabelTotal}>
					{props.currencySymbol}
					{props.total}
				</span>{' '}
				of {props.currencySymbol}
				{props.goal} goal
			</p>
		</div>
	);
}

export function Ticker(props: TickerProps): JSX.Element {
	const progressBarTransform = `translate3d(${progressBarTranslation(
		props.total,
		props.end,
	)}%, 0, 0)`;

	return (
		<div>
			<h2 css={tickerHeadline}>{props.headline}</h2>
			<div css={tickerProgressBar}>
				<div css={tickerProgressBarBackground}>
					<div
						css={tickerProgressBarFill}
						style={{
							transform: progressBarTransform,
						}}
					/>
				</div>
			</div>
			<TickerLabel
				countType={props.countType}
				currencySymbol={props.currencySymbol}
				total={props.total}
				goal={props.goal}
			/>
		</div>
	);
}
