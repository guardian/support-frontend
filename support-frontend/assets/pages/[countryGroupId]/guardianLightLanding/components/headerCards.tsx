import type { SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import {
	from,
	headlineBold24,
	palette,
	space,
	textSans15,
	textSans17,
} from '@guardian/source/foundations';
import { Container } from 'components/layout/container';
import { simpleFormatAmount } from 'helpers/forms/checkouts';
import { currencies } from 'helpers/internationalisation/currency';
import {
	productCatalog,
	productCatalogGuardianLight,
} from 'helpers/productCatalog';
import { isCode } from 'helpers/urls/url';
import type { GeoId } from 'pages/geoIdConfig';
import { getGeoIdConfig } from 'pages/geoIdConfig';
import { GuardianLightCards } from './guardianLightCards';

const container = `
	> div {
		padding: ${space[5]}px 10px;
		${from.mobileLandscape} {
			padding-left: ${space[5]}px;
			padding-right: ${space[5]}px;
		}
		${from.desktop} {
			max-width: 940px;
		}
	}
`;
const containerCards = `
	background-color: ${palette.brand[400]};
	border-bottom: 1px solid ${palette.brand[600]};
`;
const containerSignIn = `
	background-color: ${palette.brand[400]};
	${from.tablet} {
		background-color: ${palette.neutral[97]};
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
	padding: 0px 0px ${space[1]}px;
	> a {
		color: ${palette.neutral[100]};
		font-weight: bold;
	}
	${from.tablet} {
		color: ${palette.neutral[7]};
		padding: ${space[3]}px 0px ${space[4]}px;
		text-align: center;
		> a {
			color: ${palette.brand[500]};
		}
	}
	${from.desktop} {
		${textSans17}
	}
`;
function concatToCss(combine: string[]): SerializedStyles {
	return css`
		${combine.concat()}
	`;
}

const codeOrProd = isCode() ? 'code.dev-theguardian' : 'theguardian';
const SignInUrl = `https://manage.${codeOrProd}.com`;
const SignInLink = <a href={SignInUrl}>sign in</a>;

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
		<>
			<Container
				sideBorders
				topBorder
				borderColor="rgba(170, 170, 180, 0.5)"
				cssOverrides={concatToCss([container, containerCards])}
			>
				<h1 css={heading}>Choose how to read the Guardian</h1>
				<GuardianLightCards cardsContent={[card1, card2]} />
			</Container>
			<Container
				sideBorders
				borderColor="rgba(170, 170, 180, 0.5)"
				cssOverrides={concatToCss([container, containerSignIn])}
			>
				<div css={signIn}>
					If you already have Guardian Light or read the Guardian ad-free,{' '}
					{SignInLink}
				</div>
			</Container>
		</>
	);
}
