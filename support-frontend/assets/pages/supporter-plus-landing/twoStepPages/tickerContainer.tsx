import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
import { Ticker } from '@guardian/source-development-kitchen/react-components';
import type { TickerSettings } from '../../../helpers/globalsAndSwitches/landingPageSettings';

const containerStyle = css`
	max-width: 600px;
	margin: ${space[6]}px auto;
`;

interface TickerContainerProps {
	tickerSettings: TickerSettings;
}

export function TickerContainer({
	tickerSettings,
}: TickerContainerProps): JSX.Element {
	const tickerStylingSettings = {
		headlineColour: '#FFFFFF',
		totalColour: '#64B7C4',
		goalColour: '#FFFFFF',
		filledProgressColour: '#64B7C4',
		progressBarBackgroundColour: 'rgba(100, 183, 196, 0.3)',
	};

	if (window.guardian.tickerData) {
		return (
			<div css={containerStyle}>
				<Ticker
					currencySymbol={tickerSettings.currencySymbol}
					copy={{
						headline: tickerSettings.copy.countLabel,
						goalCopy: tickerSettings.copy.goalCopy,
					}}
					tickerData={window.guardian.tickerData[tickerSettings.name]}
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
