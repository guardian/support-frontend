import { css } from '@emotion/react';
import { from, space, until } from '@guardian/source/foundations';
import { Button } from '@guardian/source/react-components';
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
import { getAmount } from 'helpers/contributions';
import { simpleFormatAmount } from 'helpers/forms/checkouts';
import { countryGroups } from 'helpers/internationalisation/countryGroup';
import { currencies } from 'helpers/internationalisation/currency';
import { resetValidation } from 'helpers/redux/checkout/checkoutActions';
import {
	setCoverTransactionCost,
	setSelectedAmount,
} from 'helpers/redux/checkout/product/actions';
import { isSupporterPlusFromState } from 'helpers/redux/checkout/product/selectors/isSupporterPlus';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import {
	getUserSelectedAmount,
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
import { CoverTransactionCost } from '../components/coverTransactionCost';
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

const paymentButtonSpacing = css`
	margin-top: ${space[6]}px;
	${from.tablet} {
		margin-top: ${space[8]}px;
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

	const otherAmount = useContributionsSelector(getUserSelectedOtherAmount);
	const isSupporterPlus = useContributionsSelector(isSupporterPlusFromState);

	const coverTransactionCost =
		useContributionsSelector(
			(state) => state.page.checkoutForm.product.coverTransactionCost,
		) ?? false;

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
				const amountToBePassed = otherAmount === 'other' ? 'other' : amount;
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

	return (
		<SupporterPlusCheckoutScaffold thankYouRoute={thankYouRoute} isPaymentPage>
			<Box cssOverrides={shorterBoxMargin}>
				<BoxContents>
					{showPriceCards ? (
						<>
							<ContributionsPriceCards paymentFrequency={contributionType} />
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
								contributionType={contributionType}
								currency={currencyId}
								amount={amount}
								productKey={product}
							/>
						)}
						<CoverTransactionCost
							transactionCost={coverTransactionCost}
							transactionCostAmount={simpleFormatAmount(
								currency,
								transactionCoverCost,
							)}
							onChecked={(check) => {
								dispatch(setCoverTransactionCost(check));
							}}
							transactionCostTotal={simpleFormatAmount(currency, amount)}
						/>
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
