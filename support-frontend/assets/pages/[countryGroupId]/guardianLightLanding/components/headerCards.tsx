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
	productCatalogGuardianAdLite,
} from 'helpers/productCatalog';
import { isCode } from 'helpers/urls/url';
import type { GeoId } from 'pages/geoIdConfig';
import { getGeoIdConfig } from 'pages/geoIdConfig';
import { GuardianAdLiteCards } from './guardianAdLiteCards';

const containerCardsAndSignIn = css`
	background-color: ${palette.brand[400]};
	${from.tablet} {
		background-color: ${palette.neutral[97]};
	}
	> div {
		position: relative;
		display: grid;
		justify-content: center;
		padding: 44px 10px 0px;
		${from.mobileLandscape} {
			padding-left: ${space[5]}px;
			padding-right: ${space[5]}px;
		}
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
	padding: ${space[5]}px 0px ${space[6]}px;
	> a {
		color: ${palette.neutral[100]};
		font-weight: bold;
	}
	${from.tablet} {
		color: ${palette.neutral[7]};
		padding: ${space[8]}px 0px ${space[9]}px;
		text-align: center;
		> a {
			color: ${palette.brand[500]};
		}
	}
	${from.desktop} {
		${textSans17}
	}
`;

const codeOrProd = isCode() ? 'code.dev-theguardian' : 'theguardian';
const SignInUrl = `https://manage.${codeOrProd}.com`;
const SignInLink = <a href={SignInUrl}>sign in</a>;

type HeaderCardsProps = {
	geoId: GeoId;
	returnLink?: string;
};

export function HeaderCards({
	geoId,
	returnLink,
}: HeaderCardsProps): JSX.Element {
	const contributionType = 'Monthly';
	const { currencyKey } = getGeoIdConfig(geoId);
	const currency = currencies[currencyKey];
	const price =
		productCatalog.GuardianLight.ratePlans[contributionType].pricing[
			currencyKey
		];
	const formattedPrice = simpleFormatAmount(currency, price);

	const guardianLightParams = {
		product: 'GuardianLight',
		ratePlan: contributionType,
	};
	const card1UrlParams = new URLSearchParams(
		returnLink
			? {
					...guardianLightParams,
					returnAddress: returnLink,
			  }
			: guardianLightParams,
	);
	const checkoutLink = `checkout?${card1UrlParams.toString()}`;
	const card1 = {
		link: checkoutLink,
		productDescription: productCatalogGuardianAdLite().GuardianAdLite,
		ctaCopy: `Get Guardian Ad-Lite for ${formattedPrice}/month`,
	};
	const card2 = {
		link: returnLink ?? `https://www.theguardian.com`,
		productDescription: productCatalogGuardianAdLite().GuardianAdLiteGoBack,
		ctaCopy: `Go back to 'Accept all'`,
	};
	return (
		<>
			<Container
				sideBorders
				topBorder
				borderColor="rgba(170, 170, 180, 0.5)"
				cssOverrides={containerCardsAndSignIn}
			>
				<h1 css={heading}>Choose how to read the Guardian</h1>
				<GuardianAdLiteCards cardsContent={[card1, card2]} />
				<div css={signIn}>
					If you already have Guardian Ad-Lite or read the Guardian ad-free,{' '}
					{SignInLink}
				</div>
			</Container>
		</>
	);
}
