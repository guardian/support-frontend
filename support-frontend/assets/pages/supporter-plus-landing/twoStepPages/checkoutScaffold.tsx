import { css } from '@emotion/react';
import { cmp } from '@guardian/consent-management-platform';
import {
	from,
	palette,
	space,
	textSans,
	until,
} from '@guardian/source-foundations';
import { Column, Columns, Hide } from '@guardian/source-react-components';
import {
	FooterLinks,
	FooterWithContents,
} from '@guardian/source-react-components-development-kitchen';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckoutHeading } from 'components/checkoutHeading/checkoutHeading';
import { CheckoutHeadingImage } from 'components/checkoutHeading/checkoutHeadingImage';
import type { CountryGroupSwitcherProps } from 'components/countryGroupSwitcher/countryGroupSwitcher';
import CountryGroupSwitcher from 'components/countryGroupSwitcher/countryGroupSwitcher';
import GridImage from 'components/gridImage/gridImage';
import { CountrySwitcherContainer } from 'components/headers/simpleHeader/countrySwitcherContainer';
import { Header } from 'components/headers/simpleHeader/simpleHeader';
import { Container } from 'components/layout/container';
import { LoadingOverlay } from 'components/loadingOverlay/loadingOverlay';
import Nav from 'components/nav/nav';
import { PageScaffold } from 'components/page/pageScaffold';
import { SecureTransactionIndicator } from 'components/secureTransactionIndicator/secureTransactionIndicator';
import HeadlineImageDesktop from 'components/svgs/headlineImageDesktop';
import HeadlineImageMobile from 'components/svgs/headlineImageMobile';
import {
	AUDCountries,
	Canada,
	EURCountries,
	GBPCountries,
	International,
	NZDCountries,
	UnitedStates,
} from 'helpers/internationalisation/countryGroup';
import { useContributionsSelector } from 'helpers/redux/storeHooks';
import { LandingPageHeading } from 'pages/digital-subscriber-checkout/components/landingPageHeading';
import { CheckoutDivider } from '../components/checkoutDivider';
import { GuardianTsAndCs } from '../components/guardianTsAndCs';
import { PatronsMessage } from '../components/patronsMessage';

const checkoutContainer = (
	isPaymentPage?: boolean,
	showUsEoy2023Content?: boolean,
) => {
	type SpaceRange = 2 | 3 | 6;
	let paddingTop: SpaceRange = 6;
	if (isPaymentPage) {
		paddingTop = 2;
	} else if (!showUsEoy2023Content) {
		paddingTop = 3;
	}

	return css`
		position: relative;
		color: ${palette.neutral[7]};
		${textSans.medium()};
		padding-top: ${space[paddingTop]}px;
	`;
};

const darkBackgroundContainerMobile = css`
	background-color: ${palette.neutral[97]};
	${until.tablet} {
		background-color: ${palette.brand[400]};
		border-bottom: 1px solid ${palette.brand[600]};
	}
`;

const subHeadingUnitedStates = css`
	${textSans.medium()};
	padding-right: ${space[2]}px;
`;

const subHeading = css`
	${textSans.medium()};
	padding-right: ${space[2]}px;
	padding-bottom: 32px;
`;

const secureIndicatorSpacing = css`
	margin-bottom: ${space[3]}px;
	${from.tablet} {
		margin-bottom: ${space[4]}px;
	}
`;

const leftColImageHeader = css`
	${from.desktop} {
		text-align: left;
		padding-bottom: ${space[6]}px;
		img {
			max-width: 100%;
		}
	}
`;

const leftColImage = css`
	text-align: center;
	height: 0px;
	img {
		max-width: 100%;
	}
`;

const leftColImageUnitedStates = css`
	margin-left: -${space[5]}px;
	margin-top: 6px;

	img {
		display: block;
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

export function SupporterPlusCheckoutScaffold({
	children,
	thankYouRoute,
	isPaymentPage,
	isUsEoy2023CampaignEnabled = false,
}: {
	children: React.ReactNode;
	thankYouRoute: string;
	isPaymentPage?: true;
	isUsEoy2023CampaignEnabled?: boolean;
}): JSX.Element {
	const { countryGroupId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);

	const { paymentComplete, isWaiting } = useContributionsSelector(
		(state) => state.page.form,
	);

	const navigate = useNavigate();

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
		selectedCountryGroup: countryGroupId,
		subPath: '/contribute',
	};

	const showUsEoy2023Content =
		isUsEoy2023CampaignEnabled && countryGroupId === 'UnitedStates';

	const headingUSEoy2023 = (
		<LandingPageHeading
			heading={
				<>
					Make a<br />
					year-end gift
					<br />
					to the Guardian
				</>
			}
		/>
	);

	useEffect(() => {
		if (paymentComplete) {
			navigate(thankYouRoute, { replace: true });
		}
	}, [paymentComplete]);

	return (
		<PageScaffold
			header={
				<>
					<Header>
						{!isPaymentPage && (
							<Hide from="desktop">
								<CountrySwitcherContainer>
									<CountryGroupSwitcher {...countrySwitcherProps} />
								</CountrySwitcherContainer>
							</Hide>
						)}
					</Header>
					{!isPaymentPage && <Nav {...countrySwitcherProps} />}
				</>
			}
			footer={
				<FooterWithContents>
					<FooterLinks links={links}></FooterLinks>
				</FooterWithContents>
			}
		>
			{isPaymentPage && (
				<CheckoutHeading withTopBorder={isPaymentPage}></CheckoutHeading>
			)}

			{!isPaymentPage &&
				(showUsEoy2023Content ? (
					<CheckoutHeading
						heading={headingUSEoy2023}
						image={
							<figure css={leftColImageUnitedStates}>
								<GridImage
									gridId="supporterPlusLandingUnitedStates"
									srcSizes={[420]}
									sizes="420px"
									imgType="png"
									altText=""
								/>
							</figure>
						}
						withTopBorder={isPaymentPage}
					>
						<p css={subHeadingUnitedStates}>
							We rely on funding from readers, not shareholders or a billionaire
							owner. Join the more than 250,000 readers in the US whose regular
							support helps to sustain our journalism.
						</p>
					</CheckoutHeading>
				) : (
					<CheckoutHeadingImage
						heading={
							<figure css={leftColImageHeader}>
								<Hide from="desktop">
									<HeadlineImageMobile />
								</Hide>
								<Hide until="desktop">
									<HeadlineImageDesktop />
								</Hide>
							</figure>
						}
						image={
							<figure css={leftColImage}>
								<GridImage
									gridId="supporterPlusLanding"
									srcSizes={[817, 408, 204]}
									sizes="204px"
									imgType="png"
									altText=""
								/>
							</figure>
						}
						withTopBorder={isPaymentPage}
					>
						<p css={subHeading}>
							As a reader-funded news organisation, we rely on your generosity.
							Please give what you can, so millions can benefit from quality
							reporting on the events shaping our world.
						</p>
					</CheckoutHeadingImage>
				))}

			<Container sideBorders cssOverrides={darkBackgroundContainerMobile}>
				<Columns
					cssOverrides={checkoutContainer(isPaymentPage, showUsEoy2023Content)}
					collapseUntil="tablet"
				>
					<Column span={[0, 2, 5]}></Column>
					<Column span={[1, 8, 7]}>
						{isPaymentPage && (
							<SecureTransactionIndicator
								align="center"
								theme="light"
								cssOverrides={secureIndicatorSpacing}
							/>
						)}
						{children}
						<CheckoutDivider spacing="loose" mobileTheme={'light'} />
						<PatronsMessage
							countryGroupId={countryGroupId}
							mobileTheme={'light'}
						/>
						<CheckoutDivider spacing="tight" mobileTheme={'light'} />
						<GuardianTsAndCs mobileTheme={'light'} />
					</Column>
				</Columns>
			</Container>
			{isWaiting && (
				<LoadingOverlay>
					<p>Processing transaction</p>
					<p>Please wait</p>
				</LoadingOverlay>
			)}
		</PageScaffold>
	);
}
