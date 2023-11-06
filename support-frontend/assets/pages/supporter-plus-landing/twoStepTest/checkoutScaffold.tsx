import { css } from '@emotion/react';
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
import { CheckoutDivider } from '../components/checkoutDivider';
import { GuardianTsAndCs } from '../components/guardianTsAndCs';
import { LandingPageHeading } from '../components/landingPageHeading';
import { PatronsMessage } from '../components/patronsMessage';

const checkoutContainer = (isPaymentPage?: boolean) => css`
	position: relative;
	color: ${palette.neutral[7]};
	${textSans.medium()};
	padding-top: ${space[isPaymentPage ? 2 : 6]}px;
	padding-bottom: ${space[9]}px;
	${from.tablet} {
		padding-top: 40px;
		padding-bottom: ${space[12]}px;
	}
`;

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
`;

const secureIndicatorSpacing = css`
	margin-bottom: ${space[3]}px;
	${from.tablet} {
		margin-bottom: ${space[4]}px;
	}
`;

const leftColImage = css`
	height: 140px;
	margin-top: ${space[6]}px;
	margin-left: -${space[9]}px;
	margin-right: ${space[5]}px;

	img {
		max-width: 100%;
	}
`;

const leftColImageUnitedStates = css`
	margin-left: -${space[5]}px;

	img {
		display: block;
	}
`;

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
	const heading =
		countryGroupId === 'UnitedStates' ? (
			<LandingPageHeading heading="Make a year-end gift to the Guardian" />
		) : (
			<LandingPageHeading heading="Support&nbsp;fearless, independent journalism" />
		);

	useEffect(() => {
		if (paymentComplete) {
			navigate(thankYouRoute, { replace: true });
		}
	}, [paymentComplete]);

	return (
		<PageScaffold
			id="supporter-plus-landing"
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
					<FooterLinks></FooterLinks>
				</FooterWithContents>
			}
		>
			<CheckoutHeading
				heading={!isPaymentPage && heading}
				image={
					!isPaymentPage &&
					(countryGroupId === 'UnitedStates' ? (
						<figure css={leftColImageUnitedStates}>
							<GridImage
								gridId="supporterPlusLandingUnitedStates"
								srcSizes={[420]}
								sizes="420px"
								imgType="jpg"
								altText=""
							/>
						</figure>
					) : (
						<figure css={leftColImage}>
							<GridImage
								gridId="supporterPlusLanding"
								srcSizes={[500]}
								sizes="500px"
								imgType="png"
								altText=""
							/>
						</figure>
					))
				}
				withTopborder={isPaymentPage}
			>
				{!isPaymentPage &&
					(countryGroupId === 'UnitedStates' ? (
						<p css={subHeading}>
							We rely on funding from readers, not from a billionaire owner.
							Join the more than 250,000 readers in the US whose regular support
							helps to sustain our journalism long term.
						</p>
					) : (
						<p css={subHeading}>
							As a reader-funded news organisation, we rely on your generosity.
							Please give what you can, so millions can benefit from quality
							reporting on the events shaping our world.
						</p>
					))}
			</CheckoutHeading>

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
