import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
import type { TickerData } from '@guardian/source-development-kitchen/dist/react-components/ticker/Ticker';
import { Ticker } from '@guardian/source-development-kitchen/react-components';
import { useEffect, useState } from 'react';
import { fetchJson } from '../../../helpers/async/fetch';
import type { TickerSettings } from '../../../helpers/globalsAndSwitches/landingPageSettings';
import { isCodeOrProd } from '../../../helpers/urls/url';

const containerStyle = css`
	max-width: 600px;
	margin: ${space[6]}px auto;
`;

function getTickerUrl(tickerId: string) {
	return isCodeOrProd() ? `/ticker/${tickerId}.json` : '/ticker.json';
}

async function getInitialTickerValues(tickerId: string): Promise<TickerData> {
	const data = await fetchJson<{ total: number; goal: number }>(
		getTickerUrl(tickerId),
		{},
	);
	const total = Math.floor(data.total);
	const goal = Math.floor(data.goal);
	return {
		total,
		goal,
	};
}

interface TickerContainerProps {
	tickerSettings: TickerSettings;
}

export function TickerContainer({
	tickerSettings,
}: TickerContainerProps): JSX.Element {
	const [tickerData, setTickerData] = useState<TickerData | undefined>();
	const tickerStylingSettings = {
		headlineColour: '#000000',
		totalColour: '#64B7C4',
		goalColour: '#FFFFFF',
		filledProgressColour: '#64B7C4',
		progressBarBackgroundColour: 'rgba(100, 183, 196, 0.3)',
	};

	useEffect(() => {
		void getInitialTickerValues(tickerSettings.name).then(setTickerData);
	}, []);

	if (tickerData) {
		return (
			<div css={containerStyle}>
				<Ticker
					currencySymbol={tickerSettings.currencySymbol}
					copy={{
						headline: tickerSettings.copy.countLabel,
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
