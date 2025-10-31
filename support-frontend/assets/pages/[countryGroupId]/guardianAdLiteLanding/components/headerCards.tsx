import { css } from '@emotion/react';
import {
	from,
	headlineBold28,
	headlineBold42,
	palette,
	space,
	textSans15,
	textSans17,
} from '@guardian/source/foundations';
import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { Container } from 'components/layout/container';
import { simpleFormatAmount } from 'helpers/forms/checkouts';
import { currencies } from 'helpers/internationalisation/currency';
import {
	getProductLabel,
	productCatalog,
	productCatalogGuardianAdLite,
} from 'helpers/productCatalog';
import { isCode } from 'helpers/urls/url';
import { getSupportRegionIdConfig } from '../../../supportRegionConfig';
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
		padding: ${space[2]}px 10px 0px;
		${from.tablet} {
			padding-top: ${space[6]}px;
		}
		${from.desktop} {
			padding: 42px ${space[5]}px 0px;
		}
	}
`;
const heading = css`
	color: ${palette.neutral[100]};
	text-align: left;
	${headlineBold28}
	margin-bottom: ${space[6]}px;
	${from.tablet} {
		text-align: center;
	}
	${from.desktop} {
		font-size: ${headlineBold42};
		margin-bottom: ${space[10]}px;
	}
`;
const signIn = css`
	padding: ${space[5]}px 0px ${space[6]}px;
	${from.tablet} {
		justify-self: center;
		padding: ${space[8]}px 0px ${space[9]}px;
	}
`;
const paragraph = css`
	${textSans15}
	color: ${palette.neutral[100]};
	text-align: left;
	> a {
		color: ${palette.neutral[100]};
		font-weight: bold;
	}
	${from.tablet} {
		color: ${palette.neutral[7]};
		text-align: center;
		max-width: 620px;
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
	supportRegionId: SupportRegionId;
	isSignedIn: boolean;
	returnLink: string;
	enablePremiumDigital: boolean;
};

export function HeaderCards({
	supportRegionId,
	isSignedIn,
	returnLink,
	enablePremiumDigital,
}: HeaderCardsProps): JSX.Element {
	const contributionType = 'Monthly';
	const { currencyKey } = getSupportRegionIdConfig(supportRegionId);
	const currency = currencies[currencyKey];
	const price =
		productCatalog.GuardianAdLite?.ratePlans[contributionType]?.pricing[
			currencyKey
		];
	const formattedPrice = simpleFormatAmount(currency, price ?? 0);

	const guardianAdLiteParams = {
		product: 'GuardianAdLite',
		ratePlan: contributionType,
	};
	const card1UrlParams = new URLSearchParams(guardianAdLiteParams);
	const checkoutLink = `checkout?${card1UrlParams.toString()}`;
	const card1 = {
		link: checkoutLink,
		productDescription: productCatalogGuardianAdLite().GuardianAdLite,
		ctaCopy: `Get Guardian Ad-Lite for ${formattedPrice}/month`,
	};
	const card2 = {
		link: returnLink,
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
				<h1 css={heading}>Choose your advertising preferences</h1>
				<GuardianAdLiteCards
					cardsContent={[card1, card2]}
					isSignedIn={isSignedIn}
				/>
				{!isSignedIn && (
					<div css={signIn}>
						<p css={paragraph}>
							If you already have Guardian Ad-Lite or another Guardian
							subscription that offers ad-free reading, such as{' '}
							{getProductLabel('SupporterPlus', enablePremiumDigital)}, you
							should, {SignInLink}
						</p>
					</div>
				)}
			</Container>
		</>
	);
}
