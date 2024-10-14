import { css } from '@emotion/react';
import {
	from,
	neutral,
	space,
	textSans,
	until,
} from '@guardian/source/foundations';
import { Button } from '@guardian/source/react-components';
import { useNavigate } from 'react-router-dom';
import { Checkbox } from 'components/checkbox/Checkbox';
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
import { getAmount } from 'helpers/contributions';
import { simpleFormatAmount } from 'helpers/forms/checkouts';
import { countryGroups } from 'helpers/internationalisation/countryGroup';
import { currencies } from 'helpers/internationalisation/currency';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import { resetValidation } from 'helpers/redux/checkout/checkoutActions';
import {
	setCoverTransactionCost,
	setSelectedAmount,
} from 'helpers/redux/checkout/product/actions';
import { isSupporterPlusFromState } from 'helpers/redux/checkout/product/selectors/isSupporterPlus';
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
import { useAbandonedBasketCookie } from 'helpers/storage/abandonedBasketCookies';
import { navigateWithPageView } from 'helpers/tracking/trackingOphan';
import { CheckoutDivider } from '../components/checkoutDivider';
import { ContributionsPriceCards } from '../components/contributionsPriceCards';
import { PaymentFailureMessage } from '../components/paymentFailure';
import { PaymentTsAndCs, SummaryTsAndCs } from '../components/paymentTsAndCs';
import { getPaymentMethodButtons } from '../paymentButtons';
import { threeTierCheckoutEnabled } from '../setup/threeTierChecks';
import { SupporterPlusCheckoutScaffold } from './checkoutScaffold';

const shorterBoxMargin = css`
	:not(:last-child) {
		${until.tablet} {
			margin-bottom: ${space[2]}px;
		}
	}
`;

const shortenDivider = css`
	hr {
		margin: ${space[4]}px 0px ${space[3]}px;
		${from.tablet} {
			margin: ${space[5]}px 0px ${space[3]}px;
		}
	}
`;

const coverTransactionCheckboxContainer = css`
	padding: ${space[3]}px;
	background-color: ${neutral[97]};
	border-radius: 12px;
`;

const paymentButtonSpacing = css`
	${from.tablet} {
		margin-top: ${space[5]}px;
	}
`;

const coverTransactionSummary = css`
	${textSans.large({ fontWeight: 'bold' })};
	display: flex;
	justify-content: space-between;
	padding: 0px 0px ${space[2]}px;
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
	const currency = currencies[currencyId];

	const { supportInternationalisationId } = countryGroups[countryGroupId];
	const contributionType = useContributionsSelector(getContributionType);
	const amount = useContributionsSelector(getUserSelectedAmount);

	const amountBeforeTransactionCostCovered = useContributionsSelector((state) =>
		getAmount(
			state.page.checkoutForm.product.selectedAmounts,
			state.page.checkoutForm.product.otherAmounts,
			contributionType,
			false,
		),
	);
	const transactionCoverCost = amountBeforeTransactionCostCovered * 0.04;

	const amountBeforeAmendments = useContributionsSelector(
		getUserSelectedAmountBeforeAmendment,
	);
	const otherAmount = useContributionsSelector(getUserSelectedOtherAmount);
	const hideTransactionCoverCost = amount === 0 && otherAmount === 'other';

	const isSupporterPlus = useContributionsSelector(isSupporterPlusFromState);

	const coverTransactionCost = useContributionsSelector(
		(state) => state.page.checkoutForm.product.coverTransactionCost,
	);

	const navigate = useNavigate();
	const { abParticipations, amounts } = useContributionsSelector(
		(state) => state.common,
	);

	const inThreeTier = threeTierCheckoutEnabled(abParticipations, amounts);
	const showPriceCards = inThreeTier && contributionType === 'ONE_OFF';
	const product = isSupporterPlus ? 'SupporterPlus' : 'Contribution';

	useAbandonedBasketCookie(
		product,
		amount,
		contributionType,
		supportInternationalisationId,
		abParticipations.abandonedBasket === 'variant',
	);

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
				const destination = `/${supportInternationalisationId}/contribute`;
				navigateWithPageView(navigate, destination, abParticipations);
			}}
		>
			Change
		</Button>
	);

	const showCoverTransactionCost =
		abParticipations.coverTransactionCost === 'variant';

	return (
		<SupporterPlusCheckoutScaffold thankYouRoute={thankYouRoute} isPaymentPage>
			<Box cssOverrides={shorterBoxMargin}>
				<BoxContents>
					{showPriceCards ? (
						<>
							<ContributionsPriceCards paymentFrequency={contributionType} />
							{showCoverTransactionCost && !hideTransactionCoverCost && (
								<div css={shortenDivider}>
									<div
										css={[
											paymentButtonSpacing,
											coverTransactionCheckboxContainer,
										]}
									>
										<Checkbox
											checked={coverTransactionCost}
											onChange={(e) => {
												if (e.target.checked) {
													sendTrackingEventsOnClick({
														id: 'cover-transaction-cost-checkbox',
														componentType: 'ACQUISITIONS_BUTTON',
													})();
												}
												dispatch(setCoverTransactionCost(e.target.checked));
											}}
											label={`I’d like to add a further ${simpleFormatAmount(
												currency,
												transactionCoverCost,
											)} to cover the cost of this transaction, so that all of my support goes to powering independent, high quality journalism.`}
										/>
									</div>
									<CheckoutDivider spacing="tight" />
									<div css={coverTransactionSummary}>
										Total amount
										<div>{simpleFormatAmount(currency, amount)}</div>
									</div>
								</div>
							)}
						</>
					) : (
						<ContributionsOrderSummaryContainer
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
						{contributionType !== 'ONE_OFF' && (
							<SummaryTsAndCs
								countryGroupId={countryGroupId}
								contributionType={contributionType}
								currency={currencyId}
								amount={amount}
								productKey={product}
							/>
						)}
						<PaymentButtonController
							cssOverrides={paymentButtonSpacing}
							paymentButtons={getPaymentMethodButtons(
								contributionType,
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
						amountIsAboveThreshold={isSupporterPlus}
						productKey={product}
					/>
				</BoxContents>
			</Box>
		</SupporterPlusCheckoutScaffold>
	);
}
