import { css } from '@emotion/react';
import { space, until } from '@guardian/source-foundations';
import { Link } from 'react-router-dom';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
import { PaymentRequestButtonContainer } from 'components/paymentRequestButton/paymentRequestButtonContainer';
import { SavedCardButton } from 'components/savedCardButton/savedCardButton';
import { SecureTransactionIndicator } from 'components/secureTransactionIndicator/secureTransactionIndicator';
import { ContributionsStripe } from 'components/stripe/contributionsStripe';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import { getUserSelectedAmount } from 'helpers/redux/checkout/product/selectors/selectedAmount';
import { useContributionsSelector } from 'helpers/redux/storeHooks';
import { shouldShowSupporterPlusMessaging } from 'helpers/supporterPlus/showMessaging';
import { PaymentTsAndCs } from '../components/paymentTsAndCs';
import { AmountAndBenefits } from '../formSections/amountAndBenefits';
import { LimitedPriceCards } from '../formSections/limitedPriceCards';
import { SupporterPlusCheckoutScaffold } from './checkoutScaffold';

const shorterBoxMargin = css`
	:not(:last-child) {
		${until.tablet} {
			margin-bottom: ${space[2]}px;
		}
	}
`;

export function SupporterPlusInitialLandingPage({
	thankYouRoute,
}: {
	thankYouRoute: string;
}): JSX.Element {
	const { countryGroupId, currencyId } = useContributionsSelector(
		(state) => state.common.internationalisation,
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
	const { abParticipations } = useContributionsSelector(
		(state) => state.common,
	);

	const displayLimitedPriceCards =
		abParticipations.supporterPlusOnly === 'variant';

	return (
		<SupporterPlusCheckoutScaffold thankYouRoute={thankYouRoute}>
			<Box cssOverrides={shorterBoxMargin}>
				{displayLimitedPriceCards ? (
					<LimitedPriceCards />
				) : (
					<AmountAndBenefits
						countryGroupId={countryGroupId}
						amountIsAboveThreshold={amountIsAboveThreshold}
					/>
				)}
			</Box>
			<Box cssOverrides={shorterBoxMargin}>
				<BoxContents>
					{/* The same Stripe provider *must* enclose the Stripe card form and payment button(s). Also enclosing the PRB reduces re-renders. */}
					<ContributionsStripe>
						<SecureTransactionIndicator />
						<PaymentRequestButtonContainer CustomButton={SavedCardButton} />
						<Link
							to={`checkout?selected-amount=${amount}&selected-contribution-type=${contributionType.toLowerCase()}`}
						>
							Continue to checkout
						</Link>
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
