import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import {
	fromCountryGroupId,
	glyph,
} from 'helpers/internationalisation/currency';
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
	countryGroupId: CountryGroupId;
	headline: string;
};

type TickerLabelProps = {
	total: number;
	goal: number;
	countType: TickerCountType;
	countryGroupId: CountryGroupId;
};

const localesByCountryGroup: Record<CountryGroupId, string> = {
	UnitedStates: 'en-US',
	Canada: 'en-US',
	International: 'en-US',
	GBPCountries: 'en-GB',
	EURCountries: 'en-GB',
	AUDCountries: 'en-GB',
	NZDCountries: 'en-GB',
};

function progressBarTranslation(total: number, end: number) {
	const percentage = (total / end) * 100 - 100;
	return percentage > 0 ? 0 : percentage;
}

function localiseAmount(amount: number, countryGroupId: CountryGroupId) {
	return amount.toLocaleString(localesByCountryGroup[countryGroupId]);
}

function TickerLabel(props: TickerLabelProps) {
	if (props.countType === 'people') {
		return (
			<div css={tickerLabelContainer}>
				<p css={tickerLabel}>
					<span css={tickerLabelTotal}>
						{localiseAmount(props.total, props.countryGroupId)} supporters
					</span>{' '}
					of {localiseAmount(props.goal, props.countryGroupId)} goal
				</p>
			</div>
		);
	}

	const currencySymbol = glyph(fromCountryGroupId(props.countryGroupId));
	return (
		<div css={tickerLabelContainer}>
			<p css={tickerLabel}>
				<span css={tickerLabelTotal}>
					{currencySymbol}
					{localiseAmount(props.total, props.countryGroupId)}
				</span>{' '}
				of {currencySymbol}
				{localiseAmount(props.goal, props.countryGroupId)} goal
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
			{props.headline.length > 0 && (
				<h2 css={tickerHeadline}>{props.headline}</h2>
			)}
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
				countryGroupId={props.countryGroupId}
				total={props.total}
				goal={props.goal}
			/>
		</div>
	);
}
