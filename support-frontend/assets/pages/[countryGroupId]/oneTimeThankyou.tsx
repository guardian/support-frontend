import { css } from '@emotion/react';
import { from, space, sport } from '@guardian/source/foundations';
import type { AppConfig } from 'helpers/globalsAndSwitches/window';
import { type GeoId } from 'pages/geoIdConfig';
import { ThankYouComponent } from './components/thankyou';

export const checkoutContainer = css`
	${from.tablet} {
		background-color: ${sport[800]};
	}
`;

export const headerContainer = css`
	${from.desktop} {
		width: 83%;
	}
	${from.leftCol} {
		width: calc(75% - ${space[3]}px);
	}
`;

export const buttonContainer = css`
	padding: ${space[12]}px 0;
`;

type OneTimeThankyouProps = {
	geoId: GeoId;
	appConfig: AppConfig;
};

export function OneTimeThankYou({ geoId, appConfig }: OneTimeThankyouProps) {
	const searchParams = new URLSearchParams(window.location.search);
	const contributionParam = searchParams.get('contribution');
	const contributionAmount = contributionParam
		? parseInt(contributionParam, 10)
		: undefined;
	const finalAmount = contributionAmount ?? 0;
	const payment = {
		originalAmount: finalAmount,
		finalAmount: finalAmount,
	};

	return (
		<ThankYouComponent
			geoId={geoId}
			appConfig={appConfig}
			payment={payment}
			productKey={'Contribution'}
		/>
	);
}
