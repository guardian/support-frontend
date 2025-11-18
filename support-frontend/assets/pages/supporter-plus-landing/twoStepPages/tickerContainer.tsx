import { css, type SerializedStyles } from '@emotion/react';
import { space } from '@guardian/source/foundations';
import type { TickerData } from '@guardian/source-development-kitchen/dist/react-components/ticker/Ticker';
import { Ticker } from '@guardian/source-development-kitchen/react-components';
import { z } from 'zod';
import type {
	TickerName,
	TickerSettings,
} from '../../../helpers/globalsAndSwitches/landingPageSettings';

const tickersSchema = z.record(
	z.custom<TickerName>(),
	z.object({
		goal: z.number(),
		total: z.number(),
	}),
);

const getTickerData = (name: TickerName): TickerData | undefined => {
	if (window.guardian.tickerData) {
		const result = tickersSchema.safeParse(window.guardian.tickerData);
		if (result.data) {
			return result.data[name];
		} else {
			console.error('Invalid ticker data');
		}
	}
	return undefined;
};

const containerStyle = css`
	max-width: 600px;
	margin: ${space[6]}px auto;
`;

interface TickerContainerProps {
	tickerSettings: TickerSettings;
	cssOverrides?: SerializedStyles;
}

export function TickerContainer({
	tickerSettings,
	cssOverrides = css``,
}: TickerContainerProps): JSX.Element {
	const tickerStylingSettings = {
		headlineColour: '#FFFFFF',
		totalColour: '#64B7C4',
		goalColour: '#FFFFFF',
		filledProgressColour: '#64B7C4',
		progressBarBackgroundColour: 'rgba(100, 183, 196, 0.3)',
	};

	const tickerData = getTickerData(tickerSettings.name);

	if (tickerData) {
		return (
			<div css={[containerStyle, cssOverrides]}>
				<Ticker
					currencySymbol={tickerSettings.currencySymbol}
					copy={{
						headline: tickerSettings.copy.countLabel,
						goalCopy: tickerSettings.copy.goalCopy,
					}}
					tickerData={tickerData}
					tickerStylingSettings={{
						headlineColour: tickerStylingSettings.headlineColour,
						totalColour: tickerStylingSettings.totalColour,
						goalColour: tickerStylingSettings.goalColour,
						filledProgressColour: tickerStylingSettings.filledProgressColour,
						progressBarBackgroundColour:
							tickerStylingSettings.progressBarBackgroundColour,
					}}
					size={'large'}
				/>
			</div>
		);
	}
	return <></>;
}
