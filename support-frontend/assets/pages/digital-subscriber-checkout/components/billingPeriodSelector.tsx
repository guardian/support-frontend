import { css } from '@emotion/react';
import {
	from,
	headlineBold28,
	palette,
	space,
	textSans12,
	textSans17,
	textSansBold14,
	until,
} from '@guardian/source/foundations';
import { ChoiceCard, ChoiceCardGroup } from '@guardian/source/react-components';
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
	${headlineBold28}
`;

const subheading = css`
	${textSans17};
`;

const choiceCardContainer = css`
	div {
		${from.mobileLandscape} {
			column-gap: ${space[1]}px;
		}
		${from.tablet} {
			column-gap: ${space[2]}px;
		}
	}
`;

const choiceCardWrapper = css`
	width: 100%;
`;

const offerText = css`
	${textSansBold14};
	color: ${palette.brand[500]};
`;

const offerDetails = css`
	${textSans12};
	color: #606060;
	width: 90%;
`;

const boldText = css`
	font-weight: bold;
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
				<h2 css={heading}>The Guardian Digital Edition</h2>
				<p css={subheading}>Subscribe below to unlock the following benefits</p>
			</div>
			<div css={cardsContainer}>
				<ChoiceCardGroup
					name="billingPeriod"
					cssOverrides={choiceCardContainer}
				>
					<div css={choiceCardWrapper}>
						<p css={offerText}>
							{promotions.monthlyPrice?.discount?.amount
								? `${promotions.monthlyPrice.discount.amount}% off regular monthly price`
								: ''}
						</p>
						<ChoiceCard
							id="monthly"
							label={`${monthlyPrice} per month`}
							value="monthly"
							checked={billingPeriod === 'Monthly'}
							onChange={() => dispatch(setBillingPeriod('Monthly'))}
						/>
						{promotions.monthlyPrice?.discount?.amount && (
							<p css={offerDetails}>
								{monthlyPrice} per month for the first{' '}
								{promotions.monthlyPrice.discount.durationMonths} months. Then{' '}
								{basePrices.monthlyPrice} per month.
							</p>
						)}
					</div>
					<div css={choiceCardWrapper}>
						<p css={offerText}>
							{promotions.annualPrice?.discount?.amount
								? `${promotions.annualPrice.discount.amount}% off regular annual price`
								: ''}
						</p>
						<ChoiceCard
							id="annual"
							label={`${annualPrice} per year`}
							value="annual"
							checked={billingPeriod === 'Annual'}
							onChange={() => dispatch(setBillingPeriod('Annual'))}
						/>
						{promotions.annualPrice?.discount?.amount && (
							<p css={offerDetails}>
								{annualPrice} for{' '}
								{promotions.annualPrice.numberOfDiscountedPeriods} year. Then{' '}
								{basePrices.annualPrice} per year.
							</p>
						)}
					</div>
				</ChoiceCardGroup>
			</div>

			<CheckoutBenefitsList
				title={''}
				buttonCopy={null}
				handleButtonClick={() => undefined}
				checkListData={[
					{
						isChecked: true,
						text: (
							<p>
								<span css={boldText}>The Digital Edition app. </span>Enjoy the
								Guardian and Observer newspaper, available for mobile and tablet
							</p>
						),
					},
					{
						isChecked: true,
						text: (
							<p>
								<span css={boldText}>Full access to the Guardian app. </span>
								Read our reporting on the go
							</p>
						),
					},
					{
						isChecked: true,
						text: (
							<p>
								<span css={boldText}>Free 14 day trial. </span>Enjoy a free
								trial of your subscription, before you pay
							</p>
						),
					},
				]}
			/>
		</BoxContents>
	);
}
