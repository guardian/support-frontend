import { css } from '@emotion/react';
import {
	from,
	headlineBold24,
	palette,
	space,
	textSans15,
	textSans17,
} from '@guardian/source/foundations';
import { simpleFormatAmount } from 'helpers/forms/checkouts';
import { currencies } from 'helpers/internationalisation/currency';
import {
	productCatalog,
	productCatalogGuardianLight,
} from 'helpers/productCatalog';
import type { GeoId } from 'pages/geoIdConfig';
import { getGeoIdConfig } from 'pages/geoIdConfig';
import { ComponentContainer } from './componentContainer';
import { GuardianLightCards } from './guardianLightCards';

const container = css`
	background-color: ${palette.brand[400]};
	border-bottom: 1px solid ${palette.brand[600]};
	> div {
		padding: ${space[5]}px 10px ${space[4]}px;
	}
`;

const heading = css`
	color: ${palette.neutral[100]};
	text-align: left;
	${headlineBold24}
	margin-bottom: ${space[6]}px;
	${from.tablet} {
		text-align: center;
	}
	${from.desktop} {
		font-size: 2.625rem;
		margin-bottom: ${space[10]}px;
	}
`;
const signIn = css`
	color: ${palette.neutral[100]};
	text-align: left;
	${textSans15}
	margin: ${space[5]}px 0px;
	${from.tablet} {
		text-align: center;
	}
	${from.desktop} {
		${textSans17}
	}
	> a {
		color: ${palette.neutral[100]};
		font-weight: bold;
	}
`;

const SignInUrl = 'https://manage.theguardian.com/signin';
const SignInLink = <a href={SignInUrl}>Sign In</a>;

type HeaderCardsProps = {
	geoId: GeoId;
};

export function HeaderCards({ geoId }: HeaderCardsProps): JSX.Element {
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
		ctaCopy: 'Go back to "accept all"',
	};
	return (
		<ComponentContainer
			sideBorders
			topBorder
			borderColor="rgba(170, 170, 180, 0.5)"
			cssOverrides={container}
		>
			<h1 css={heading}>Choose how to read the Guardian</h1>
			<GuardianLightCards cardsContent={[card1, card2]} />
			<div css={signIn}>
				If you already have Guardian Light or read the Guardian ad-free,{' '}
				{SignInLink}
			</div>
		</ComponentContainer>
	);
}
