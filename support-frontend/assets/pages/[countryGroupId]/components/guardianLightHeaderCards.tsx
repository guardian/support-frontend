import { css } from '@emotion/react';
import {
	from,
	headlineBold24,
	palette,
	space,
} from '@guardian/source/foundations';
import { Container } from 'components/layout/container';
import { simpleFormatAmount } from 'helpers/forms/checkouts';
import { currencies } from 'helpers/internationalisation/currency';
import {
	productCatalog,
	productCatalogGuardianLight,
} from 'helpers/productCatalog';
import type { GeoId } from 'pages/geoIdConfig';
import { getGeoIdConfig } from 'pages/geoIdConfig';
import { GuardianLightCards } from './guardianLightCards';

const container = css`
	background-color: ${palette.brand[400]};
	border-bottom: 1px solid ${palette.brand[600]};
	> div {
		padding: ${space[2]}px 10px ${space[4]}px;
	}
	${from.mobileLandscape} {
		> div {
			padding: ${space[2]}px ${space[5]}px ${space[4]}px;
		}
	}
	${from.tablet} {
		border-bottom: none;
		> div {
			padding: ${space[2]}px 10px ${space[4]}px;
		}
	}
	${from.desktop} {
		> div {
			padding: 40px 10px 72px;
		}
	}
`;
const innerContainer = css`
	max-width: 940px;
	margin: ${space[2]}px auto;
	text-align: center;
	${from.desktop} {
		margin: 0px auto;
	}
`;

const heading = css`
	text-align: left;
	color: ${palette.neutral[100]};
	${headlineBold24}
	margin-bottom: ${space[4]}px;
	${from.tablet} {
		text-align: center;
	}
	${from.desktop} {
		font-size: 2.625rem;
		margin-bottom: ${space[10]}px;
	}
`;
const headingAboveMobile = css`
	display: none;
	${from.tablet} {
		display: block;
	}
`;
const headingBelowMobile = css`
	display: block;
	${from.tablet} {
		display: none;
	}
`;

type GuardianLightHeaderCardsProps = {
	geoId: GeoId;
};

export function GuardianLightHeaderCards({
	geoId,
}: GuardianLightHeaderCardsProps): JSX.Element {
	const contributionType = 'Monthly';
	const { currencyKey } = getGeoIdConfig(geoId);
	const currency = currencies[currencyKey];
	const price =
		productCatalog.GuardianLight.ratePlans[contributionType].pricing[
			currencyKey
		];
	const formattedPrice = simpleFormatAmount(currency, price);

	const card1UrlParams = new URLSearchParams({
		product: 'GuardianLight',
		ratePlan: contributionType,
		contribution: price.toString(),
	});
	const checkoutLink = `checkout?${card1UrlParams.toString()}`;
	const card1 = {
		link: checkoutLink,
		productDescription: productCatalogGuardianLight().GuardianLight,
		ctaCopy: `Get Guardian Light for ${formattedPrice}/month`,
	};

	const returnLink = `https://www.theguardian.com/${geoId}`; // ToDo : store and use return path
	const card2 = {
		link: returnLink,
		productDescription: productCatalogGuardianLight().GuardianLightGoBack,
		ctaCopy: 'Return to privacy options',
	};
	return (
		<Container
			sideBorders
			topBorder
			borderColor="rgba(170, 170, 180, 0.5)"
			cssOverrides={container}
		>
			<div css={innerContainer}>
				<h1 css={[heading, headingAboveMobile]}>
					Choose how to read the Guardian
				</h1>
				<h1 css={[heading, headingBelowMobile]}>Choose one option</h1>
				<GuardianLightCards cardsContent={[card1, card2]} />
			</div>
		</Container>
	);
}
