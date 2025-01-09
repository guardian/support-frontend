import { css } from '@emotion/react';
import { cmp } from '@guardian/libs';
import {
	from,
	headlineBold24,
	palette,
	space,
	textSans17,
} from '@guardian/source/foundations';
import { Container } from '@guardian/source/react-components';
import {
	FooterLinks,
	FooterWithContents,
} from '@guardian/source-development-kitchen/react-components';
import { useState } from 'preact/hooks';
import { Header } from 'components/headers/simpleHeader/simpleHeader';
import { PageScaffold } from 'components/page/pageScaffold';
import { PaymentFrequencyButtons } from 'components/paymentFrequencyButtons/paymentFrequencyButtons';
import { getAmountsTestVariant } from 'helpers/abTests/abtest';
import type { ContributionType } from 'helpers/contributions';
import { Country } from 'helpers/internationalisation/classes/country';
import type { GeoId } from 'pages/geoIdConfig';
import { getGeoIdConfig } from 'pages/geoIdConfig';
import { AmountsCard } from '../components/amountsCard';

const recurringContainer = css`
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

const innerContentContainer = css`
	max-width: 940px;
	margin: 0 auto;
	text-align: center;
`;

const heading = css`
	text-align: left;
	color: ${palette.neutral[100]};
	${headlineBold24}
	${from.tablet} {
		text-align: center;
	}
	${from.desktop} {
		font-size: 2.625rem;
	}
`;

const standFirst = css`
	text-align: left;
	color: ${palette.neutral[100]};
	margin: 0 0 ${space[4]}px;
	${textSans17};
	line-height: 1.35;
	strong {
		font-weight: bold;
	}
	${from.tablet} {
		text-align: center;
		width: 65%;
		margin: 0 auto;
	}
	${from.desktop} {
		margin: ${space[4]}px auto ${space[9]}px;
	}
`;

const paymentFrequencyButtonsCss = css`
	margin: ${space[4]}px auto 32px;
	${from.desktop} {
		margin: 0 auto ${space[9]}px;
	}
`;

const disclaimerContainer = css`
	background-color: ${palette.brand[400]};
	> div {
		border-bottom: 1px solid ${palette.brand[600]};
		padding: ${space[4]}px 10px;
	}
	${from.mobileLandscape} {
		> div {
			padding: ${space[5]}px ${space[5]}px;
		}
	}
`;

const links = [
	{
		href: 'https://www.theguardian.com/info/privacy',
		text: 'Privacy policy',
		isExternal: true,
	},
	{
		text: 'Privacy settings',
		onClick: () => {
			cmp.showPrivacyManager();
		},
	},
	{
		href: 'https://www.theguardian.com/help/contact-us',
		text: 'Contact us',
		isExternal: true,
	},
	{
		href: 'https://www.theguardian.com/help',
		text: 'Help centre',
		isExternal: true,
	},
];

const paymentFrequencyMap = {
	ONE_OFF: 'One-time',
	MONTHLY: 'Monthly',
	ANNUAL: 'Annual',
};

type ContributionsOnlyLandingProps = {
	geoId: GeoId;
};
export function ContributionsOnlyLanding({
	geoId,
}: ContributionsOnlyLandingProps): JSX.Element {
	const { currencyKey: currencyId, countryGroupId } = getGeoIdConfig(geoId);
	const countryId = Country.detect();

	const [contributionType, setContributionType] =
		useState<ContributionType>('MONTHLY');

	const paymentFrequencies: ContributionType[] = [
		'ONE_OFF',
		'MONTHLY',
		'ANNUAL',
	] as const;

	const handlePaymentFrequencyBtnClick = (buttonIndex: number) => {
		if (paymentFrequencies[buttonIndex]) {
			setContributionType(paymentFrequencies[buttonIndex]);
		}
	};

	const { selectedAmountsVariant: amounts } = getAmountsTestVariant(
		countryId,
		countryGroupId,
		window.guardian.settings,
	);

	return (
		<PageScaffold
			header={
				<>
					<Header>
						{/* <CountrySwitcherContainer>
							<CountryGroupSwitcher {...countrySwitcherProps} />
						</CountrySwitcherContainer> */}
					</Header>
				</>
			}
			footer={
				<FooterWithContents>
					<FooterLinks links={links}></FooterLinks>
				</FooterWithContents>
			}
		>
			<Container
				sideBorders
				topBorder
				borderColor="rgba(170, 170, 180, 0.5)"
				cssOverrides={recurringContainer}
			>
				<div css={innerContentContainer}>
					<h1 css={heading}>Support fearless, independent journalism</h1>
					<p css={standFirst}>
						We're not owned by a billionaire or shareholders - our readers
						support us. Choose to join with one of the options below.{' '}
						<strong>Cancel anytime.</strong>
					</p>
					<PaymentFrequencyButtons
						paymentFrequencies={paymentFrequencies.map(
							(paymentFrequency, index) => ({
								paymentFrequencyLabel: paymentFrequencyMap[paymentFrequency],
								paymentFrequencyId: paymentFrequency,
								isPreSelected: paymentFrequencies[index] === contributionType,
							}),
						)}
						buttonClickHandler={handlePaymentFrequencyBtnClick}
						additionalStyles={paymentFrequencyButtonsCss}
					/>
					<AmountsCard
						amountsData={amounts.amountsCardData[contributionType]}
						countryGroupId={countryGroupId}
						currencyId={currencyId}
						contributionType={contributionType}
					/>
				</div>
			</Container>
			<Container
				sideBorders
				borderColor="rgba(170, 170, 180, 0.5)"
				cssOverrides={disclaimerContainer}
			></Container>
		</PageScaffold>
	);
}
