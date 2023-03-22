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
import { useState } from 'preact/hooks';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
import { CheckoutHeading } from 'components/checkoutHeading/checkoutHeading';
import { CheckoutSupportOnce } from 'components/checkoutSupportOnce/checkoutSupportOnce';
import { CheckoutSupportOnceContainer } from 'components/checkoutSupportOnce/checkoutSupportOnceContainer';
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
import { init as initAbTests } from 'helpers/abTests/abtest';
import { getSettings } from 'helpers/globalsAndSwitches/globals';
import { detect as detectCountry } from 'helpers/internationalisation/country';
import {
	AUDCountries,
	Canada,
	EURCountries,
	GBPCountries,
	International,
	NZDCountries,
	UnitedStates,
} from 'helpers/internationalisation/countryGroup';
import { setProductType } from 'helpers/redux/checkout/product/actions';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import { getUserSelectedAmount } from 'helpers/redux/checkout/product/selectors/selectedAmount';
import { isUserInAbVariants } from 'helpers/redux/commonState/selectors';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import { shouldShowSupporterPlusMessaging } from 'helpers/supporterPlus/showMessaging';
import { CheckoutDivider } from './components/checkoutDivider';
import { DirectDebitContainer } from './components/directDebitWrapper';
import { ExistingRecurringContributorMessage } from './components/existingRecurringContributorMessage';
import { GuardianTsAndCs } from './components/guardianTsAndCs';
import { LandingPageHeading } from './components/landingPageHeading';
import { PatronsMessage } from './components/patronsMessage';
import { PaymentFailureMessage } from './components/paymentFailure';
import { PaymentTsAndCs } from './components/paymentTsAndCs';
import { AmountAndBenefits } from './formSections/amountAndBenefits';
import { getPaymentMethodButtons } from './paymentButtons';

const checkoutContainer = css`
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

const backgroundContainer = css`
	background-color: ${neutral[97]};
`;

const darkBackgroundContainerMobile = css`
	${backgroundContainer}
	${until.tablet} {
		background-color: ${brand[400]};
		border-bottom: 1px solid ${brand[600]};
	}
`;

const shorterBoxMargin = css`
	:not(:last-child) {
		${until.tablet} {
			margin-bottom: ${space[2]}px;
		}
	}
`;

const subheading = css`
	font-weight: normal;
	padding-right: ${space[2]}px;
`;

export function SupporterPlusLandingPage({
	thankYouRoute,
}: {
	thankYouRoute: string;
}): JSX.Element {
	const { countryGroupId, countryId, currencyId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);
	const { switches } = useContributionsSelector(
		(state) => state.common.settings,
	);
	const { selectedAmounts, otherAmounts } = useContributionsSelector(
		(state) => state.page.checkoutForm.product,
	);
	const contributionType = useContributionsSelector(getContributionType);
	const amount = useContributionsSelector(getUserSelectedAmount);

	const amountIsAboveThreshold = shouldShowSupporterPlusMessaging(
		contributionType,
		selectedAmounts,
		otherAmounts,
		countryGroupId,
	);

	const optimisedMobileLayout = useContributionsSelector(
		isUserInAbVariants(
			['supporterPlusMobileTest1', 'singleLessProminent'],
			'variant',
		),
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

	const participations = initAbTests(
		detectCountry(),
		countryGroupId,
		getSettings(),
	);
	const [supportOnceDisplay, setSupportOnceDisplay] = useState(
		participations.singleLessProminent === 'variant',
	);

	const dispatch = useContributionsDispatch();
	function onSupportOnceContainerClick(displaySupportOnce: boolean) {
		setSupportOnceDisplay(
			participations.singleLessProminent !== 'variant' ||
				(supportOnceDisplay && displaySupportOnce),
		);
		dispatch(setProductType('ONE_OFF'));
	}

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
				<p css={subheading}>
					As a reader-funded news organisation, we rely on your generosity.
					Please give what you can, so millions can benefit from quality
					reporting on the events shaping our world.
				</p>
			</CheckoutHeading>
			<Container
				sideBorders
				cssOverrides={
					optimisedMobileLayout
						? darkBackgroundContainerMobile
						: backgroundContainer
				}
			>
				<Columns cssOverrides={checkoutContainer} collapseUntil="tablet">
					<Column span={[0, 2, 5]}></Column>
					<Column span={[1, 8, 7]}>
						<Hide from="desktop">
							{optimisedMobileLayout ? (
								<SecureTransactionIndicator
									align="left"
									theme="light"
									cssOverrides={css`
										margin-bottom: 10px;
									`}
								/>
							) : (
								heading
							)}
						</Hide>
						<Box
							cssOverrides={optimisedMobileLayout ? shorterBoxMargin : css``}
						>
							<AmountAndBenefits hideOneOff={supportOnceDisplay} />
						</Box>
						<CheckoutSupportOnceContainer
							supportOnceDisplay={supportOnceDisplay}
							renderSupportOnce={(supportOnceProps) => (
								<CheckoutSupportOnce {...supportOnceProps} />
							)}
							onSupportOnceContainerClick={onSupportOnceContainerClick}
						/>
						<Box
							cssOverrides={optimisedMobileLayout ? shorterBoxMargin : css``}
						>
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
											<PaymentMethodSelector {...paymentMethodSelectorProps} />
										)}
									/>
									<PaymentButtonController
										cssOverrides={
											optimisedMobileLayout
												? css`
														margin-top: 30px;
												  `
												: css``
										}
										paymentButtons={getPaymentMethodButtons(
											contributionType,
											switches,
											countryId,
											countryGroupId,
										)}
									/>
									<ExistingRecurringContributorMessage />
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
						<CheckoutDivider
							spacing="loose"
							mobileTheme={optimisedMobileLayout ? 'light' : 'dark'}
						/>
						<PatronsMessage
							countryGroupId={countryGroupId}
							mobileTheme={optimisedMobileLayout ? 'light' : 'dark'}
						/>
						<CheckoutDivider
							spacing="tight"
							mobileTheme={optimisedMobileLayout ? 'light' : 'dark'}
						/>
						<GuardianTsAndCs
							mobileTheme={optimisedMobileLayout ? 'light' : 'dark'}
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
