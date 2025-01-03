import { css } from '@emotion/react';
import { neutral, space } from '@guardian/source/foundations';
import { checkListData } from 'components/checkoutBenefits/checkoutBenefitsListData';
import { type ContributionType, getAmount } from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { currencies } from 'helpers/internationalisation/currency';
import { productLegal } from 'helpers/legalCopy';
import type { ProductKey } from 'helpers/productCatalog';
import type { Promotion } from 'helpers/productPrice/promotions';
import { isSupporterPlusFromState } from 'helpers/redux/checkout/product/selectors/isSupporterPlus';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import { useContributionsSelector } from 'helpers/redux/storeHooks';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import type { ContributionsOrderSummaryProps } from './contributionsOrderSummary';

const containerSummaryTsCs = css`
	border-radius: ${space[2]}px;
	background-color: ${neutral[97]};
	padding: ${space[3]}px;
`;

type ContributionsOrderSummaryContainerProps = {
	renderOrderSummary: (props: ContributionsOrderSummaryProps) => JSX.Element;
	promotion?: Promotion;
};

export function getTermsStartDateTier3(startDateTier3: string) {
	return (
		<>
			<li>Your digital benefits will start today.</li>
			<li>
				Your Guardian Weekly subscription will start on {startDateTier3}. Please
				allow 1 to 7 days after your start date for your magazine to arrive,
				depending on national post services.
			</li>
		</>
	);
}

export function getTermsConditions(
	countryGroupId: CountryGroupId,
	contributionType: ContributionType,
	productId: string,
	promotion?: Promotion,
) {
	if (contributionType === 'ONE_OFF') {
		return;
	}
	const period = contributionType === 'MONTHLY' ? 'month' : 'year';
	const isSupporterPlus = productId === 'SupporterPlus';
	const isTier3 = productId === 'TierThree';

	if (isSupporterPlus || isTier3) {
		return (
			<div css={containerSummaryTsCs}>
				{promotion && (
					<p>
						You’ll pay{' '}
						{productLegal(
							countryGroupId,
							contributionType,
							'/',
							productId,
							promotion,
						)}{' '}
						afterwards unless you cancel. Offer only available to new
						subscribers who do not have an existing subscription with the
						Guardian.
					</p>
				)}
				{isSupporterPlus && (
					<>
						<p>Auto renews every {period} until you cancel.</p>
						<p>
							Cancel or change your support anytime. If you cancel within the
							first 14 days, you will receive a full refund.
						</p>
					</>
				)}
				{isTier3 && <p>Auto renews every {period}. Cancel anytime.</p>}
			</div>
		);
	}
	return (
		<div css={containerSummaryTsCs}>
			<p>Auto renews every {period} until you cancel.</p>
			<p>Cancel or change your support anytime.</p>
		</div>
	);
}

export function ContributionsOrderSummaryContainer({
	renderOrderSummary,
	promotion,
}: ContributionsOrderSummaryContainerProps): JSX.Element {
	const contributionType = useContributionsSelector(getContributionType);
	const { currencyId, countryGroupId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);
	const currency = currencies[currencyId];
	const isSupporterPlus = useContributionsSelector(isSupporterPlusFromState);
	const amount = useContributionsSelector((state) =>
		getAmount(
			state.page.checkoutForm.product.selectedAmounts,
			state.page.checkoutForm.product.otherAmounts,
			contributionType,
		),
	);

	const checklist =
		contributionType === 'ONE_OFF'
			? []
			: checkListData({
					higherTier: isSupporterPlus,
					countryGroupId,
			  });

	function onCheckListToggle(isOpen: boolean) {
		trackComponentClick(
			`contribution-order-summary-${isOpen ? 'opened' : 'closed'}`,
		);
	}

	let description;
	let heading;
	let product: ProductKey;
	if (contributionType === 'ONE_OFF') {
		heading = 'Your support';
		description = 'One-time support';
		product = 'Contribution';
	} else if (isSupporterPlus) {
		description = 'All-access digital';
		product = 'SupporterPlus';
	} else {
		description = 'Support';
		product = 'Contribution';
	}

	const paymentFrequency =
		contributionType === 'MONTHLY'
			? 'month'
			: contributionType === 'ANNUAL'
			? 'year'
			: '';

	return renderOrderSummary({
		description,
		amount: amount,
		promotion,
		currency,
		paymentFrequency,
		enableCheckList: contributionType !== 'ONE_OFF',
		checkListData: checklist,
		onCheckListToggle,
		heading,
		tsAndCs: getTermsConditions(
			countryGroupId,
			contributionType,
			product,
			promotion,
		),
	});
}
