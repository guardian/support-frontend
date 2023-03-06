import { css } from '@emotion/react';
import {
	brand,
	from,
	headline,
	space,
	textSans,
	until,
} from '@guardian/source-foundations';
import {
	ChoiceCard,
	ChoiceCardGroup,
	Hide,
} from '@guardian/source-react-components';
import { Divider } from '@guardian/source-react-components-development-kitchen';
import { CheckoutBenefitsList } from 'components/checkoutBenefits/checkoutBenefitsList';
import { BoxContents } from 'components/checkoutBox/checkoutBox';
import { setBillingPeriod } from 'helpers/redux/checkout/product/actions';
import {
	getSubscriptionPrices,
	getSubscriptionPricesBeforeDiscount,
	getSubscriptionPromotions,
} from 'helpers/redux/checkout/product/selectors/subscriptionPrice';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import { KindleSubscriptionBenefitsListContainer } from './subscriptionBenefitsListContainer';

const cardsContainer = css`
	position: relative;
	padding: ${space[2]}px 0;

	${from.mobileLandscape} {
		padding: ${space[3]}px 0;
	}

	${from.tablet} {
		padding: ${space[2]}px 0;
	}

	:not(:last-child) {
		${until.mobileLandscape} {
			padding-bottom: 10px;
		}
		padding-bottom: ${space[4]}px;
	}
`;

const headingContainer = css`
	margin-bottom: ${space[2]}px;
`;

const heading = css`
	${headline.small({ fontWeight: 'bold' })}
`;

const subheading = css`
	${textSans.medium()};
`;

const choiceCardWrapper = css`
	width: 100%;
`;

const divider = css`
	margin: 14px 0;
	width: 100%;
`;

const offerText = css`
	${textSans.xsmall({ fontWeight: 'bold' })}
	color: ${brand[500]};
`;

const offerDetails = css`
	${textSans.xxsmall()};
	color: #606060;
	width: 90%;
`;

export function BillingPeriodSelector(): JSX.Element {
	const dispatch = useContributionsDispatch();

	const { billingPeriod } = useContributionsSelector(
		(state) => state.page.checkoutForm.product,
	);

	const { monthlyPrice, annualPrice } = useContributionsSelector(
		getSubscriptionPrices,
	);

	const basePrices = useContributionsSelector(
		getSubscriptionPricesBeforeDiscount,
	);
	const promotions = useContributionsSelector(getSubscriptionPromotions);

	return (
		<BoxContents>
			<div css={headingContainer}>
				<h2 css={heading}>Digital subscription</h2>
				<p css={subheading}>Subscribe below to unlock the following benefits</p>
			</div>
			<div css={cardsContainer}>
				<ChoiceCardGroup name="billingPeriod">
					<div css={choiceCardWrapper}>
						<p css={offerText}>
							{promotions.monthlyPrice?.discount?.amount}% off regular monthly{' '}
							price
						</p>
						<ChoiceCard
							id="monthly"
							label={`${monthlyPrice} per month`}
							value="monthly"
							checked={billingPeriod === 'Monthly'}
							onChange={() => dispatch(setBillingPeriod('Monthly'))}
						/>
						<p css={offerDetails}>
							{monthlyPrice} per month for the first{' '}
							{promotions.monthlyPrice?.discount?.durationMonths} months. Then{' '}
							{basePrices.monthlyPrice} per month.
						</p>
					</div>
					<Hide from="tablet">
						<Divider size="full" spaceAbove="tight" cssOverrides={divider} />
					</Hide>
					<div css={choiceCardWrapper}>
						<p css={offerText}>
							{promotions.annualPrice?.discount?.amount}% off regular annual{' '}
							price
						</p>
						<ChoiceCard
							id="annual"
							label={`${annualPrice} per year`}
							value="annual"
							checked={billingPeriod === 'Annual'}
							onChange={() => dispatch(setBillingPeriod('Annual'))}
						/>
						<p css={offerDetails}>
							{annualPrice} for{' '}
							{promotions.annualPrice?.numberOfDiscountedPeriods} year. Then{' '}
							{basePrices.annualPrice} per year.
						</p>
					</div>
				</ChoiceCardGroup>
			</div>
			<KindleSubscriptionBenefitsListContainer
				renderBenefitsList={(benefitsListProps) => (
					<CheckoutBenefitsList {...benefitsListProps} />
				)}
			/>
		</BoxContents>
	);
}
