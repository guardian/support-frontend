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
import { countryGroups } from 'helpers/internationalisation/countryGroup';
import { getPromotion } from 'helpers/productPrice/promotions';
import { resetValidation } from 'helpers/redux/checkout/checkoutActions';
import { setSelectedAmount } from 'helpers/redux/checkout/product/actions';
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
import { navigateWithPageView } from 'helpers/tracking/ophan';
import { CheckoutDivider } from '../components/checkoutDivider';
import { ContributionsPriceCards } from '../components/contributionsPriceCards';
import { PaymentFailureMessage } from '../components/paymentFailure';
import { PaymentTsAndCs } from '../components/paymentTsAndCs';
import { getPaymentMethodButtons } from '../paymentButtons';
import { threeTierCheckoutEnabled } from '../setup/threeTierChecks';
import { SupporterPlusCheckoutScaffold } from './checkoutScaffold';
import * as cookie from 'helpers/storage/cookie';
import { useEffect } from 'react';

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

	//get product data 



	const dispatch = useContributionsDispatch();
	const { countryGroupId, countryId, currencyId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);
	const contributionType = useContributionsSelector(getContributionType);
	const amount = useContributionsSelector(getUserSelectedAmount);
	const amountBeforeAmendments = useContributionsSelector(
		getUserSelectedAmountBeforeAmendment,
	);
	const otherAmount = useContributionsSelector(getUserSelectedOtherAmount);
	const isSupporterPlus = useContributionsSelector(isSupporterPlusFromState);

	const navigate = useNavigate();
	const { abParticipations, amounts } = useContributionsSelector(
		(state) => state.common,
	);

	const inThreeTier = threeTierCheckoutEnabled(abParticipations, amounts);
	const showPriceCards = inThreeTier && contributionType === 'ONE_OFF';

	const abandonedBasket = {
		product:'something',
		amount,
		billingPeriod: contributionType,
		region: countryId
	};

	useEffect(() => {
		//set cookie
		cookie.set('abandonedBasket', JSON.stringify(abandonedBasket), 3)
	}, []);


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

	/** Promotions on the checkout are for SupporterPlus only for now */
	const promotion = isSupporterPlus
		? useContributionsSelector((state) =>
				getPromotion(
					state.page.checkoutForm.product.productPrices,
					countryId,
					state.page.checkoutForm.product.billingPeriod,
				),
		  )
		: undefined;
	return (
		<SupporterPlusCheckoutScaffold thankYouRoute={thankYouRoute} isPaymentPage>
			<Box cssOverrides={shorterBoxMargin}>
				<BoxContents>
					{showPriceCards ? (
						<ContributionsPriceCards paymentFrequency={contributionType} />
					) : (
						<ContributionsOrderSummaryContainer
							inThreeTier={inThreeTier}
							promotion={promotion}
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
						productNameAboveThreshold={
							inThreeTier ? 'All-access digital' : 'Supporter Plus'
						}
						promotion={promotion}
					/>
				</BoxContents>
			</Box>
		</SupporterPlusCheckoutScaffold>
	);
}
