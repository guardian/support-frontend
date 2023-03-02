import { css } from '@emotion/react';
import { from, space, until } from '@guardian/source-foundations';
import { ChoiceCard, ChoiceCardGroup } from '@guardian/source-react-components';
import { CheckoutBenefitsList } from 'components/checkoutBenefits/checkoutBenefitsList';
import { BoxContents } from 'components/checkoutBox/checkoutBox';
import { setBillingPeriod } from 'helpers/redux/checkout/product/actions';
import { getSubscriptionPrices } from 'helpers/redux/checkout/product/selectors/subscriptionPrice';
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

export function BillingPeriodSelector(): JSX.Element {
	const dispatch = useContributionsDispatch();

	const { billingPeriod } = useContributionsSelector(
		(state) => state.page.checkoutForm.product,
	);

	const { monthlyPrice, annualPrice } = useContributionsSelector(
		getSubscriptionPrices,
	);

	return (
		<BoxContents>
			<div css={cardsContainer}>
				<ChoiceCardGroup name="billingPeriod">
					<ChoiceCard
						id="monthly"
						label={`${monthlyPrice} per month`}
						value="monthly"
						checked={billingPeriod === 'Monthly'}
						onChange={() => dispatch(setBillingPeriod('Monthly'))}
					/>
					<ChoiceCard
						id="annual"
						label={`${annualPrice} per year`}
						value="annual"
						checked={billingPeriod === 'Annual'}
						onChange={() => dispatch(setBillingPeriod('Annual'))}
					/>
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
