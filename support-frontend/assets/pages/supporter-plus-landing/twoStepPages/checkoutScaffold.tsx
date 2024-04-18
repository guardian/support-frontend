import { css } from '@emotion/react';
import { cmp } from '@guardian/libs';
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
import { isSubjectToVatCompliantAmounts } from 'helpers/vatCompliance';
import HeadlineImagePatronsDesktop from '../../../components/svgs/headlineImagePatronsDesktop';
import HeadlineImagePatronsMobile from '../../../components/svgs/headlineImagePatronsMobile';
import { CheckoutDivider } from '../components/checkoutDivider';
import { GuardianTsAndCs } from '../components/guardianTsAndCs';
import { PatronsMessage } from '../components/patronsMessage';

const checkoutContainer = (isPaymentPage?: boolean) => {
	type SpaceRange = 2 | 3 | 6;
	let paddingTop: SpaceRange = 6;
	if (isPaymentPage) {
		paddingTop = 2;
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

const boldText = css`
	font-weight: 700;
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
}: {
	children: React.ReactNode;
	thankYouRoute: string;
	isPaymentPage?: true;
}): JSX.Element {
	const { countryGroupId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);

	const { paymentComplete, isWaiting } = useContributionsSelector(
		(state) => state.page.form,
	);

	const { abParticipations, amounts } = useContributionsSelector(
		(state) => state.common,
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

	useEffect(() => {
		if (paymentComplete) {
			navigate(thankYouRoute, { replace: true });
		}
	}, [paymentComplete]);

	const displayPatronsCheckout = !!abParticipations.patronsOneOffOnly;

	const countryIsAffectedByVATStatus = isSubjectToVatCompliantAmounts(amounts);

	function SubHeading() {
		if (displayPatronsCheckout) {
			if (countryGroupId === UnitedStates) {
				return (
					<p css={subHeading}>
						You are already among a small and vital number of{' '}
						<span css={boldText}>
							people whose support significantly helps to fund our work
						</span>
						. If you can, please consider topping up your support. Thank you.
					</p>
				);
			} else {
				return (
					<p css={subHeading}>
						You are already among a small and vital number of{' '}
						<span css={boldText}>
							people whose support disproportionately helps to fund our work
						</span>
						. If you can, please consider topping up your support. Thank you.
					</p>
				);
			}
		}
		return (
			<p css={subHeading}>
				As a reader-funded news organisation, we rely on your generosity. Please
				give what you can, so millions can benefit from quality reporting on the
				events shaping our world.
			</p>
		);
	}

	return (
		<PageScaffold
			header={
				<>
					<Header>
						{!countryIsAffectedByVATStatus && !isPaymentPage && (
							<Hide from="desktop">
								<CountrySwitcherContainer>
									<CountryGroupSwitcher {...countrySwitcherProps} />
								</CountrySwitcherContainer>
							</Hide>
						)}
					</Header>
					{!isPaymentPage && (
						<Nav
							{...countrySwitcherProps}
							countryIsAffectedByVATStatus={countryIsAffectedByVATStatus}
						/>
					)}
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

			{!isPaymentPage && (
				<CheckoutHeadingImage
					heading={
						<figure css={leftColImageHeader}>
							<Hide from="desktop">
								{displayPatronsCheckout ? (
									<HeadlineImagePatronsMobile />
								) : (
									<HeadlineImageMobile />
								)}
							</Hide>
							<Hide until="desktop">
								{displayPatronsCheckout ? (
									<HeadlineImagePatronsDesktop />
								) : (
									<HeadlineImageDesktop />
								)}
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
					<SubHeading />
				</CheckoutHeadingImage>
			)}

			<Container sideBorders cssOverrides={darkBackgroundContainerMobile}>
				<Columns
					cssOverrides={checkoutContainer(isPaymentPage)}
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

						{!displayPatronsCheckout && (
							<>
								<CheckoutDivider spacing="loose" mobileTheme={'light'} />
								<PatronsMessage
									countryGroupId={countryGroupId}
									mobileTheme={'light'}
								/>
							</>
						)}
						<GuardianTsAndCs
							mobileTheme={'light'}
							displayPatronsCheckout={displayPatronsCheckout}
						/>
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
