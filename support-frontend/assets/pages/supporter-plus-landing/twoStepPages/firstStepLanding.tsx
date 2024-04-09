import { css, ThemeProvider } from '@emotion/react';
import {
	between,
	from,
	neutral,
	space,
	textSans,
	until,
} from '@guardian/source-foundations';
import {
	Button,
	buttonThemeReaderRevenueBrand,
} from '@guardian/source-react-components';
import { useEffect } from 'preact/hooks';
import { useNavigate } from 'react-router';
import { Box } from 'components/checkoutBox/checkoutBox';
import { BrandedIcons } from 'components/paymentMethodSelector/creditDebitIcons';
import { PaypalIcon } from 'components/paymentMethodSelector/paypalIcon';
import { useOtherAmountValidation } from 'helpers/customHooks/useFormValidation';
import { resetValidation } from 'helpers/redux/checkout/checkoutActions';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import { getUserSelectedAmount } from 'helpers/redux/checkout/product/selectors/selectedAmount';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import { getThresholdPrice } from 'helpers/supporterPlus/benefitsThreshold';
import { navigateWithPageView } from 'helpers/tracking/ophan';
import { AmountAndBenefits } from '../formSections/amountAndBenefits';
import { LimitedPriceCards } from '../formSections/limitedPriceCards';
import { PatronsPriceCards } from '../formSections/patronsPriceCards';
import { SupporterPlusCheckoutScaffold } from './checkoutScaffold';

const boxShorterMargin = css`
	:not(:last-child) {
		${until.tablet} {
			margin-bottom: ${space[2]}px;
		}
	}
`;

// TODO : re-factor SupporterPlusCheckoutScaffold so that we do not require negative margin here, this overlays the PriceCardsAmountsBenefitsContainer over the PageScaffold
const boxHoist = css`
	${until.mobileMedium} {
		margin-top: -370px;
	}
	${between.mobileMedium.and.mobileLandscape} {
		margin-top: -358px;
	}
	${between.mobileLandscape.and.desktop} {
		margin-top: -344px;
	}
`;

const checkoutBtnAndPaymentIconsHolder = css`
	padding: 0 ${space[5]}px;
	${until.tablet} {
		margin-top: ${space[2]}px;
	}
	${from.tablet} {
		padding: 0 ${space[6]}px;
	}
`;

const checkoutBtnStyleOverrides = css`
	width: 100%;
	justify-content: center;
`;

const cancelAnytime = css`
	${textSans.xsmall()};
	text-align: center;
	color: ${neutral[20]};
	margin: ${space[3]}px 0;
	${from.tablet} {
		margin: ${space[4]}px 0 ${space[3]}px;
	}
`;

const cancelAnytimeDescription = css`
	${textSans.xxsmall()};
	color: ${neutral[20]};
	margin: ${space[4]}px 0 ${space[3]}px;
	${from.tablet} {
		margin: ${space[5]}px 0 ${space[6]}px;
	}
`;

export function SupporterPlusInitialLandingPage({
	thankYouRoute,
}: {
	thankYouRoute: string;
}): JSX.Element {
	const dispatch = useContributionsDispatch();
	const { countryGroupId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);
	const navigate = useNavigate();
	const contributionType = useContributionsSelector(getContributionType);
	const amount = useContributionsSelector(getUserSelectedAmount);

	const thresholdPrice = useContributionsSelector((state) =>
		getThresholdPrice(contributionType, state),
	);

	const { abParticipations } = useContributionsSelector(
		(state) => state.common,
	);

	const displayLimitedPriceCards =
		abParticipations.supporterPlusOnly === 'variant';

	const displayPatronsCheckout = !!abParticipations.patronsOneOffOnly;

	const proceedToNextStep = useOtherAmountValidation(() => {
		const destination = `checkout?selected-amount=${amount}&selected-contribution-type=${contributionType.toLowerCase()}`;
		navigateWithPageView(navigate, destination, abParticipations);
	}, false);

	const paymentMethodsMarginOneOff = css`
		margin: ${space[4]}px 0;
		${from.tablet} {
			margin: ${space[5]}px 0 ${space[6]}px;
		}
	`;

	const paymentMethodsMarginRecurring = css`
		margin: ${space[3]}px 0 ${space[4]}px;
		${from.tablet} {
			margin: ${space[3]}px 0 ${space[5]}px;
		}
	`;

	const paymentMethods = css`
		display: flex;
		gap: 3px;
		justify-content: center;
		${contributionType === 'ONE_OFF'
			? paymentMethodsMarginOneOff
			: paymentMethodsMarginRecurring}
	`;

	useEffect(() => {
		dispatch(resetValidation());
	}, []);

	return (
		<SupporterPlusCheckoutScaffold thankYouRoute={thankYouRoute}>
			<Box cssOverrides={[boxShorterMargin, boxHoist]}>
				{displayLimitedPriceCards ? (
					<LimitedPriceCards />
				) : displayPatronsCheckout ? (
					<PatronsPriceCards />
				) : (
					<AmountAndBenefits
						countryGroupId={countryGroupId}
						amountIsAboveThreshold={
							!!(thresholdPrice && amount >= thresholdPrice)
						}
						addBackgroundToBenefitsList
						isCompactBenefitsList
					/>
				)}

				<div css={checkoutBtnAndPaymentIconsHolder}>
					<ThemeProvider theme={buttonThemeReaderRevenueBrand}>
						<Button
							iconSide="left"
							priority="primary"
							size="default"
							cssOverrides={checkoutBtnStyleOverrides}
							onClick={proceedToNextStep}
						>
							Continue to checkout
						</Button>
					</ThemeProvider>
					{contributionType !== 'ONE_OFF' && (
						<p css={cancelAnytime}>Cancel or change at anytime</p>
					)}
					<div css={paymentMethods}>
						<PaypalIcon justLogoAndBorder />
						<BrandedIcons />
					</div>
					{thresholdPrice && amount >= thresholdPrice && (
						<p css={cancelAnytimeDescription}>
							You can cancel or change your support at anytime before your next
							billing date. If you cancel in the first 14 days, you will receive
							a full refund.
						</p>
					)}
				</div>
			</Box>
		</SupporterPlusCheckoutScaffold>
	);
}
