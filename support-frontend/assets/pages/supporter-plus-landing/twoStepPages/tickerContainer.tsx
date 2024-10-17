import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
import type { TickerData } from '@guardian/source-development-kitchen/dist/react-components/ticker/Ticker';
import { Ticker } from '@guardian/source-development-kitchen/react-components';
import { useEffect, useState } from 'react';
import { fetchJson } from '../../../helpers/async/fetch';
import type { CampaignTickerSettings } from '../../../helpers/campaigns/campaigns';
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
	tickerSettings: CampaignTickerSettings;
}

export function TickerContainer({
	tickerSettings,
}: TickerContainerProps): JSX.Element {
	const [tickerData, setTickerData] = useState<TickerData | undefined>();

	useEffect(() => {
		void getInitialTickerValues(tickerSettings.id).then(setTickerData);
	}, []);

	if (tickerData) {
		return (
			<div css={containerStyle}>
				<Ticker
					currencySymbol={tickerSettings.currencySymbol}
					copy={{
						headline: tickerSettings.copy.headline,
					}}
					tickerData={tickerData}
					tickerStylingSettings={{
						headlineColour: tickerSettings.tickerStylingSettings.headlineColour,
						totalColour: tickerSettings.tickerStylingSettings.totalColour,
						goalColour: tickerSettings.tickerStylingSettings.goalColour,
						filledProgressColour:
							tickerSettings.tickerStylingSettings.filledProgressColour,
						progressBarBackgroundColour:
							tickerSettings.tickerStylingSettings.progressBarBackgroundColour,
					}}
					size={tickerSettings.size}
				/>
			</div>
		);
	}
	return <></>;
}
