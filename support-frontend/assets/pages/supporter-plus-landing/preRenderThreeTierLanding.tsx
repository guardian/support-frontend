import { css } from '@emotion/react';
import { cmp } from '@guardian/libs';
import { from, palette, space } from '@guardian/source/foundations';
import { Container } from '@guardian/source/react-components';
import {
	FooterLinks,
	FooterWithContents,
} from '@guardian/source-development-kitchen/react-components';
import CountryGroupSwitcher from 'components/countryGroupSwitcher/countryGroupSwitcher';
import type { CountryGroupSwitcherProps } from 'components/countryGroupSwitcher/countryGroupSwitcher';
import { CountrySwitcherContainer } from 'components/headers/simpleHeader/countrySwitcherContainer';
import { Header } from 'components/headers/simpleHeader/simpleHeader';
import { PageScaffold } from 'components/page/pageScaffold';
import {
	AUDCountries,
	Canada,
	EURCountries,
	GBPCountries,
	International,
	NZDCountries,
	UnitedStates,
} from 'helpers/internationalisation/countryGroup';
import { PrerenderGlobalStyles } from 'helpers/rendering/prerenderGlobalStyles';

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
			padding: 40px 10px ${space[6]}px;
		}
	}
`;

const oneTimeContainer = (withShortPaddingBottom: boolean) => css`
	display: flex;
	background-color: ${palette.neutral[97]};
	> div {
		padding: ${space[6]}px 10px ${withShortPaddingBottom ? space[6] : '72'}px;
	}
	${from.desktop} {
		> div {
			padding-bottom: ${withShortPaddingBottom ? space[9] : space[24]}px;
		}
	}
`;

function PreRenderThreeTierLanding(): JSX.Element {
	const countrySwitcherProps: CountryGroupSwitcherProps = {
		countryGroupIds: [
			GBPCountries,
			UnitedStates,
			AUDCountries,
			EURCountries,
			NZDCountries,
			Canada,
			International,
		],
		selectedCountryGroup: GBPCountries,
		subPath: '/contribute',
	};

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

	return (
		<PageScaffold
			header={
				<>
					<Header>
						<CountrySwitcherContainer>
							<CountryGroupSwitcher {...countrySwitcherProps} />
						</CountrySwitcherContainer>
					</Header>
				</>
			}
			footer={
				<FooterWithContents>
					<FooterLinks links={links}></FooterLinks>
				</FooterWithContents>
			}
		>
			<PrerenderGlobalStyles />
			{/* <Container
				sideBorders
				topBorder
				borderColor="rgba(170, 170, 180, 0.5)"
				cssOverrides={recurringContainer}
			> */}
			{/* <div css={innerContentContainer}>
					<h1 css={heading}>
						Support fearless, <br css={tabletLineBreak} />
						independent journalism
					</h1>
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
					<ThreeTierCards
						cardsContent={[tier1Card, tier2Card, tier3Card]}
						currencyId={currencyId}
						paymentFrequency={contributionType}
						linkCtaClickHandler={handleLinkCtaClick}
					/>
				</div> */}
			{/* </Container> */}
			<Container
				sideBorders
				borderColor="rgba(170, 170, 180, 0.5)"
				cssOverrides={oneTimeContainer(false)}
			>
				{/* <SupportOnce
					currency={currencies[currencyId].glyph}
					btnClickHandler={handleSupportOnceBtnClick}
				/>
				{countryGroupId === UnitedStates && (
					<div css={suppportAnotherWayContainer}>
						<h4>Support another way</h4>
						<p>
							To learn more about other ways to support the Guardian, including
							checks and tax-exempt options, please visit our{' '}
							<a href="https://manage.theguardian.com/help-centre/article/contribute-another-way?INTCMP=gdnwb_copts_support_contributions_referral">
								help page
							</a>{' '}
							on this topic.
						</p>
					</div>
				)} */}
			</Container>
		</PageScaffold>
	);
}

export const threeTierLanding = <PreRenderThreeTierLanding />;
