import { css } from '@emotion/react';
import { space, until } from '@guardian/source-foundations';
import { Button } from '@guardian/source-react-components';
import { useNavigate } from 'react-router-dom';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
import { ContributionsOrderSummary } from 'components/orderSummary/contributionsOrderSummary';
import { ContributionsOrderSummaryContainer } from 'components/orderSummary/contributionsOrderSummaryContainer';
import { PaymentButtonController } from 'components/paymentButton/paymentButtonController';
import { PaymentMethodSelector } from 'components/paymentMethodSelector/paymentMethodSelector';
import PaymentMethodSelectorContainer from 'components/paymentMethodSelector/PaymentMethodSelectorContainer';
import { PaymentRequestButtonContainer } from 'components/paymentRequestButton/paymentRequestButtonContainer';
import { PersonalDetails } from 'components/personalDetails/personalDetails';
import { PersonalDetailsContainer } from 'components/personalDetails/personalDetailsContainer';
import { SavedCardButton } from 'components/savedCardButton/savedCardButton';
import { ContributionsStripe } from 'components/stripe/contributionsStripe';
import type { ThresholdAmounts } from 'helpers/contributions';
import { countryGroups } from 'helpers/internationalisation/countryGroup';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import { getPromotion } from 'helpers/productPrice/promotions';
import { resetValidation } from 'helpers/redux/checkout/checkoutActions';
import {
	setOtherAmount,
	setSelectedAmount,
} from 'helpers/redux/checkout/product/actions';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import {
	getUserSelectedAmount,
	getUserSelectedAmountBeforeAmendment,
	getUserSelectedOtherAmount,
} from 'helpers/redux/checkout/product/selectors/selectedAmount';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import { getThresholdPrice } from 'helpers/supporterPlus/benefitsThreshold';
import { shouldShowSupporterPlusMessaging } from 'helpers/supporterPlus/showMessaging';
import { navigateWithPageView } from 'helpers/tracking/ophan';
import { CheckoutDivider } from '../components/checkoutDivider';
import { ContributionsPriceCards } from '../components/contributionsPriceCards';
import { PaymentFailureMessage } from '../components/paymentFailure';
import { PaymentTsAndCs } from '../components/paymentTsAndCs';
import { getPaymentMethodButtons } from '../paymentButtons';
import {
	showThreeTierCheckout,
	showThreeTierVariablePrice,
} from '../setup/threeTierABTest';
import type { TierPlans } from '../setup/threeTierConfig';
import { SupporterPlusCheckoutScaffold } from './checkoutScaffold';

const shorterBoxMargin = css`
	:not(:last-child) {
		${until.tablet} {
			margin-bottom: ${space[2]}px;
		}
	}
`;

export function SupporterPlusCheckout({
	thankYouRoute,
}: {
	thankYouRoute: string;
}): JSX.Element {
	const dispatch = useContributionsDispatch();
	const { countryGroupId, countryId, currencyId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);
	const { switches } = useContributionsSelector(
		(state) => state.common.settings,
	);
	const contributionType = useContributionsSelector(getContributionType);
	const tierContributionType =
		contributionType === 'ANNUAL' ? 'ANNUAL' : 'MONTHLY';
	const tierPlanPeriod = tierContributionType.toLowerCase() as keyof TierPlans;
	const billingPeriod = (tierPlanPeriod[0].toUpperCase() +
		tierPlanPeriod.slice(1)) as BillingPeriod;
	const promotion = useContributionsSelector((state) =>
		getPromotion(
			state.page.checkoutForm.product.productPrices,
			countryId,
			billingPeriod,
		),
	);

	const amount = useContributionsSelector(getUserSelectedAmount);
	const amountBeforeAmendments = useContributionsSelector(
		getUserSelectedAmountBeforeAmendment,
	);
	const otherAmount = useContributionsSelector(getUserSelectedOtherAmount);
	const { selectedAmounts, otherAmounts } = useContributionsSelector(
		(state) => state.page.checkoutForm.product,
	);
	const amountIsAboveThreshold = shouldShowSupporterPlusMessaging(
		contributionType,
		selectedAmounts,
		otherAmounts,
		countryGroupId,
		promotion,
	);

	const promotionMonthly = useContributionsSelector((state) =>
		getPromotion(
			state.page.checkoutForm.product.productPrices,
			countryId,
			'Monthly',
		),
	);
	const monthlyBenefitsThreshold = getThresholdPrice(
		countryGroupId,
		'MONTHLY',
		promotionMonthly,
	);
	const promotionAnnual = useContributionsSelector((state) =>
		getPromotion(
			state.page.checkoutForm.product.productPrices,
			countryId,
			'Annual',
		),
	);
	const annualBenefitsThreshold = getThresholdPrice(
		countryGroupId,
		'ANNUAL',
		promotionAnnual,
	);
	const thresholdAmounts: ThresholdAmounts = {
		MONTHLY: monthlyBenefitsThreshold,
		ANNUAL: annualBenefitsThreshold,
	};

	const navigate = useNavigate();
	const { abParticipations } = useContributionsSelector(
		(state) => state.common,
	);
	const inThreeTier = showThreeTierCheckout(abParticipations);
	const inThreeTierVariantVariable =
		showThreeTierVariablePrice(abParticipations);

	const showPriceCards =
		(inThreeTier && contributionType === 'ONE_OFF') ||
		(inThreeTierVariantVariable && !amountIsAboveThreshold);

	const changeButton = (
		<Button
			priority="tertiary"
			size="xsmall"
			onClick={() => {
				const amountToBePassed =
					otherAmount === 'other' ? 'other' : amountBeforeAmendments;
				dispatch(
					setSelectedAmount({
						contributionType: contributionType,
						amount: `${amountToBePassed}`,
					}),
				);
				// 3-tier Other amount over S+ threshold will not re-display unless reset
				if (inThreeTierVariantVariable && amountIsAboveThreshold) {
					dispatch(
						setOtherAmount({
							contributionType: contributionType,
							amount: '',
						}),
					);
				}
				dispatch(resetValidation());
				const destination = `/${countryGroups[countryGroupId].supportInternationalisationId}/contribute`;
				navigateWithPageView(navigate, destination, abParticipations);
			}}
		>
			Change
		</Button>
	);

	return (
		<SupporterPlusCheckoutScaffold thankYouRoute={thankYouRoute} isPaymentPage>
			<Box cssOverrides={shorterBoxMargin}>
				<BoxContents>
					{showPriceCards ? (
						<ContributionsPriceCards paymentFrequency={contributionType} />
					) : (
						<ContributionsOrderSummaryContainer
							inThreeTier={inThreeTier}
							amountIsAboveThreshold={amountIsAboveThreshold}
							renderOrderSummary={(orderSummaryProps) => (
								<ContributionsOrderSummary
									{...orderSummaryProps}
									headerButton={changeButton}
								/>
							)}
						/>
					)}
				</BoxContents>
			</Box>
			<Box cssOverrides={shorterBoxMargin}>
				<BoxContents>
					{/* The same Stripe provider *must* enclose the Stripe card form and payment button(s). Also enclosing the PRB reduces re-renders. */}
					<ContributionsStripe>
						<PaymentRequestButtonContainer CustomButton={SavedCardButton} />
						<PersonalDetailsContainer
							renderPersonalDetails={(personalDetailsProps) => (
								<PersonalDetails
									{...personalDetailsProps}
									overrideHeadingCopy="1. Your details"
								/>
							)}
						/>
						<CheckoutDivider spacing="loose" />
						<PaymentMethodSelectorContainer
							render={(paymentMethodSelectorProps) => (
								<PaymentMethodSelector
									{...paymentMethodSelectorProps}
									overrideHeadingCopy="2. Payment method"
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
					</ContributionsStripe>
					<PaymentTsAndCs
						countryGroupId={countryGroupId}
						contributionType={contributionType}
						currency={currencyId}
						amount={amount}
						amountThresholds={thresholdAmounts}
						amountIsAboveThreshold={amountIsAboveThreshold}
						productNameAboveThreshold={
							inThreeTier ? 'All-access digital' : 'Supporter Plus'
						}
					/>
				</BoxContents>
			</Box>
		</SupporterPlusCheckoutScaffold>
	);
}
