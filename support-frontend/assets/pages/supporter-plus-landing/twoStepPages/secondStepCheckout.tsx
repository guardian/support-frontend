import { css } from '@emotion/react';
import { space, until } from '@guardian/source-foundations';
import { Button } from '@guardian/source-react-components';
import { useNavigate } from 'react-router-dom';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
import { ContributionsOrderSummary } from 'components/orderSummary/contributionsOrderSummary';
import { ContributionsOrderSummaryContainer } from 'components/orderSummary/contributionsOrderSummaryContainer';
import { OtherAmount } from 'components/otherAmount/otherAmount';
import { PaymentButtonController } from 'components/paymentButton/paymentButtonController';
import { PaymentMethodSelector } from 'components/paymentMethodSelector/paymentMethodSelector';
import PaymentMethodSelectorContainer from 'components/paymentMethodSelector/PaymentMethodSelectorContainer';
import { PaymentRequestButtonContainer } from 'components/paymentRequestButton/paymentRequestButtonContainer';
import { PersonalDetails } from 'components/personalDetails/personalDetails';
import { PersonalDetailsContainer } from 'components/personalDetails/personalDetailsContainer';
import { PriceCards } from 'components/priceCards/priceCards';
import { PriceCardsContainer } from 'components/priceCards/priceCardsContainer';
import { SavedCardButton } from 'components/savedCardButton/savedCardButton';
import { ContributionsStripe } from 'components/stripe/contributionsStripe';
import { countryGroups } from 'helpers/internationalisation/countryGroup';
import { resetValidation } from 'helpers/redux/checkout/checkoutActions';
import { setSelectedAmount } from 'helpers/redux/checkout/product/actions';
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
import { shouldShowSupporterPlusMessaging } from 'helpers/supporterPlus/showMessaging';
import { navigateWithPageView } from 'helpers/tracking/ophan';
import { CheckoutDivider } from '../components/checkoutDivider';
import { PaymentFailureMessage } from '../components/paymentFailure';
import { PaymentTsAndCs } from '../components/paymentTsAndCs';
import { getPaymentMethodButtons } from '../paymentButtons';
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
	const { selectedAmounts, otherAmounts } = useContributionsSelector(
		(state) => state.page.checkoutForm.product,
	);
	const { abParticipations } = useContributionsSelector(
		(state) => state.common,
	);
	const contributionType = useContributionsSelector(getContributionType);
	const amount = useContributionsSelector(getUserSelectedAmount);
	const amountBeforeAmendments = useContributionsSelector(
		getUserSelectedAmountBeforeAmendment,
	);
	const otherAmount = useContributionsSelector(getUserSelectedOtherAmount);
	const amountIsAboveThreshold = shouldShowSupporterPlusMessaging(
		contributionType,
		selectedAmounts,
		otherAmounts,
		countryGroupId,
	);

	const navigate = useNavigate();

	const isInThreeTierCheckoutTest =
		abParticipations.threeTierCheckout === 'variant';

	const showPriceCards =
		isInThreeTierCheckoutTest && contributionType === 'ONE_OFF';

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
					{!showPriceCards && (
						<ContributionsOrderSummaryContainer
							renderOrderSummary={(orderSummaryProps) => (
								<ContributionsOrderSummary
									{...orderSummaryProps}
									headerButton={changeButton}
								/>
							)}
						/>
					)}
					{showPriceCards && (
						<PriceCardsContainer
							frequency={'ONE_OFF'}
							renderPriceCards={({
								amounts,
								selectedAmount,
								otherAmount,
								currency,
								paymentInterval,
								onAmountChange,
								minAmount,
								onOtherAmountChange,
								hideChooseYourAmount,
								errors,
							}) => (
								<>
									<PriceCards
										amounts={amounts}
										selectedAmount={selectedAmount}
										currency={currency}
										paymentInterval={paymentInterval}
										onAmountChange={onAmountChange}
										hideChooseYourAmount={hideChooseYourAmount}
										otherAmountField={
											<OtherAmount
												currency={currency}
												minAmount={minAmount}
												selectedAmount={selectedAmount}
												otherAmount={otherAmount}
												onOtherAmountChange={onOtherAmountChange}
												errors={errors}
											/>
										}
									/>
								</>
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
						amountIsAboveThreshold={amountIsAboveThreshold}
					/>
				</BoxContents>
			</Box>
		</SupporterPlusCheckoutScaffold>
	);
}
