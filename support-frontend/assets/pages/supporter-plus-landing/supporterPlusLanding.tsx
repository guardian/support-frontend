import { css } from '@emotion/react';
import {
	brand,
	from,
	neutral,
	space,
	textSans,
	until,
} from '@guardian/source-foundations';
import { Column, Columns, Hide } from '@guardian/source-react-components';
import {
	FooterLinks,
	FooterWithContents,
} from '@guardian/source-react-components-development-kitchen';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
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
import { PaymentButtonController } from 'components/paymentButton/paymentButtonController';
import { PaymentMethodSelector } from 'components/paymentMethodSelector/paymentMethodSelector';
import PaymentMethodSelectorContainer from 'components/paymentMethodSelector/PaymentMethodSelectorContainer';
import { PaymentRequestButtonContainer } from 'components/paymentRequestButton/paymentRequestButtonContainer';
import { PersonalDetails } from 'components/personalDetails/personalDetails';
import { PersonalDetailsContainer } from 'components/personalDetails/personalDetailsContainer';
import { SavedCardButton } from 'components/savedCardButton/savedCardButton';
import { SecureTransactionIndicator } from 'components/secureTransactionIndicator/secureTransactionIndicator';
import { ContributionsStripe } from 'components/stripe/contributionsStripe';
import type { ContributionType } from 'helpers/contributions';
import { simpleFormatAmount } from 'helpers/forms/checkouts';
import {
	AUDCountries,
	Canada,
	EURCountries,
	GBPCountries,
	International,
	NZDCountries,
	UnitedStates,
} from 'helpers/internationalisation/countryGroup';
import { currencies } from 'helpers/internationalisation/currency';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import { getUserSelectedAmount } from 'helpers/redux/checkout/product/selectors/selectedAmount';
import { isUserInAbVariant } from 'helpers/redux/commonState/selectors';
import { useContributionsSelector } from 'helpers/redux/storeHooks';
import { shouldShowSupporterPlusMessaging } from 'helpers/supporterPlus/showMessaging';
import { CheckoutDivider } from './components/checkoutDivider';
import { DirectDebitContainer } from './components/directDebitWrapper';
import { GuardianTsAndCs } from './components/guardianTsAndCs';
import { LandingPageHeading } from './components/landingPageHeading';
import { PatronsMessage } from './components/patronsMessage';
import { PaymentFailureMessage } from './components/paymentFailure';
import { PaymentTsAndCs } from './components/paymentTsAndCs';
import StickyCta from './components/stickyCta';
import { AmountAndBenefits } from './formSections/amountAndBenefits';
import { getPaymentMethodButtons } from './paymentButtons';

const checkoutContainerCss = css`
	position: relative;
	color: ${neutral[7]};
	${textSans.medium()};

	padding-top: ${space[3]}px;
	padding-bottom: ${space[9]}px;

	${from.tablet} {
		padding-bottom: ${space[12]}px;
	}

	${from.desktop} {
		padding-top: ${space[6]}px;
	}
`;

const darkBackgroundContainerMobileCss = css`
	background-color: ${neutral[97]};
	${until.tablet} {
		background-color: ${brand[400]};
		border-bottom: 1px solid ${brand[600]};
	}
`;

const shorterBoxMarginCss = css`
	:not(:last-child) {
		${until.tablet} {
			margin-bottom: ${space[2]}px;
		}
	}
`;
const displayFullForm = (display?: boolean) => css`
	display: block;
	${until.tablet} {
		display: ${display ? 'block' : 'none'};
	}
`;

const subHeadingCss = css`
	font-weight: normal;
	padding-right: ${space[2]}px;
`;

export function SupporterPlusLandingPage({
	thankYouRoute,
}: {
	thankYouRoute: string;
}): JSX.Element {
	const contributionTypeToPaymentInterval: Partial<
		Record<ContributionType, 'month' | 'year'>
	> = {
		MONTHLY: 'month',
		ANNUAL: 'year',
	};

	const { countryGroupId, countryId, currencyId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);
	const currency = currencies[currencyId];
	const { switches } = useContributionsSelector(
		(state) => state.common.settings,
	);
	const { selectedAmounts, otherAmounts } = useContributionsSelector(
		(state) => state.page.checkoutForm.product,
	);
	const selectedAmount = useContributionsSelector(getUserSelectedAmount);
	const contributionType = useContributionsSelector(getContributionType);
	const amount = useContributionsSelector(getUserSelectedAmount);
	const amountWithCurrency = simpleFormatAmount(currency, selectedAmount);

	const amountIsAboveThreshold = shouldShowSupporterPlusMessaging(
		contributionType,
		selectedAmounts,
		otherAmounts,
		countryGroupId,
	);

	const optimisedMobileLayout2 = useContributionsSelector(
		isUserInAbVariant('supporterPlusMobileTest2', 'variant'),
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
	const heading = <LandingPageHeading />;

	useEffect(() => {
		if (paymentComplete) {
			navigate(thankYouRoute, { replace: true });
		}
	}, [paymentComplete]);

	const [fullFormDisplayed, setFullFormDisplayed] = useState(
		!optimisedMobileLayout2,
	);

	function onStickyButtonClick() {
		setFullFormDisplayed(!fullFormDisplayed);
		sendTrackingEventsOnClick({
			id: 'sticky_cta',
			componentType: 'ACQUISITIONS_BUTTON',
		})();
	}

	function getStickyButtonText(
		amountWithCurrency: string,
		paymentInterval?: 'month' | 'year',
	) {
		if (!amountWithCurrency.includes('NaN')) {
			if (paymentInterval) {
				return `Continue with ${amountWithCurrency} per ${paymentInterval}`;
			}
			return `Continue with ${amountWithCurrency}`;
		}
		return `Continue`;
	}

	return (
		<PageScaffold
			id="supporter-plus-landing"
			header={
				<>
					<Header>
						<Hide from="desktop">
							<CountrySwitcherContainer>
								<CountryGroupSwitcher {...countrySwitcherProps} />
							</CountrySwitcherContainer>
						</Hide>
					</Header>
					<Nav {...countrySwitcherProps} />
				</>
			}
			footer={
				<FooterWithContents>
					<FooterLinks></FooterLinks>
				</FooterWithContents>
			}
		>
			<CheckoutHeading
				heading={heading}
				image={
					<GridImage
						gridId="supporterPlusLanding"
						srcSizes={[500]}
						sizes="500px"
						imgType="png"
						altText=""
					/>
				}
			>
				<p css={subHeadingCss}>
					As a reader-funded news organisation, we rely on your generosity.
					Please give what you can, so millions can benefit from quality
					reporting on the events shaping our world.
				</p>
			</CheckoutHeading>
			<Container sideBorders cssOverrides={darkBackgroundContainerMobileCss}>
				<Columns cssOverrides={checkoutContainerCss} collapseUntil="tablet">
					<Column span={[0, 2, 5]}></Column>
					<Column span={[1, 8, 7]}>
						<Hide from="desktop">
							<SecureTransactionIndicator
								align="left"
								theme="light"
								cssOverrides={css`
									margin-bottom: 10px;
								`}
							/>
						</Hide>
						<Box cssOverrides={shorterBoxMarginCss}>
							<AmountAndBenefits />
						</Box>
						{optimisedMobileLayout2 && (
							<StickyCta
								isVisible={!fullFormDisplayed}
								ctaLink="#detailsAndCheckout"
								ariaControls="detailsAndCheckout"
								onCtaClick={onStickyButtonClick}
								buttonText={getStickyButtonText(
									amountWithCurrency,
									contributionTypeToPaymentInterval[contributionType],
								)}
							/>
						)}
						<div
							role="region"
							id="detailsAndCheckout"
							css={displayFullForm(fullFormDisplayed)}
						>
							<Box cssOverrides={shorterBoxMarginCss}>
								<BoxContents>
									{/* The same Stripe provider *must* enclose the Stripe card form and payment button(s). Also enclosing the PRB reduces re-renders. */}
									<ContributionsStripe>
										<SecureTransactionIndicator />
										<PaymentRequestButtonContainer
											CustomButton={SavedCardButton}
										/>
										<PersonalDetailsContainer
											renderPersonalDetails={(personalDetailsProps) => (
												<PersonalDetails {...personalDetailsProps} />
											)}
										/>
										<CheckoutDivider spacing="loose" />
										<PaymentMethodSelectorContainer
											render={(paymentMethodSelectorProps) => (
												<PaymentMethodSelector
													{...paymentMethodSelectorProps}
												/>
											)}
										/>
										<PaymentButtonController
											cssOverrides={css`
												margin-top: 30px;
											`}
											paymentButtons={getPaymentMethodButtons(
												contributionType,
												switches,
												countryId,
												countryGroupId,
											)}
										/>
										<PaymentFailureMessage />
										<DirectDebitContainer />
									</ContributionsStripe>
									<PaymentTsAndCs
										countryGroupId={countryGroupId}
										contributionType={contributionType}
										currency={currencyId}
										amount={amount}
										amountIsAboveThreshold={amountIsAboveThreshold}
									/>
								</BoxContents>
							</Box>
							<CheckoutDivider spacing="loose" mobileTheme={'light'} />
							<PatronsMessage
								countryGroupId={countryGroupId}
								mobileTheme={'light'}
							/>
							<CheckoutDivider spacing="tight" mobileTheme={'light'} />
							<GuardianTsAndCs mobileTheme={'light'} />
						</div>
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
