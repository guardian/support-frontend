import { checkListData } from 'components/checkoutBenefits/checkoutBenefitsListData';
import {
	type ContributionType,
	getAmount,
	type RegularContributionType,
} from 'helpers/contributions';
import { currencies } from 'helpers/internationalisation/currency';
import { isSupporterPlusFromState } from 'helpers/redux/checkout/product/selectors/isSupporterPlus';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import { getUserSelectedAmount } from 'helpers/redux/checkout/product/selectors/selectedAmount';
import { useContributionsSelector } from 'helpers/redux/storeHooks';
import { getLowerBenefitsThreshold } from 'helpers/supporterPlus/benefitsThreshold';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import type { ContributionsOrderSummaryProps } from './contributionsOrderSummary';

type ContributionsOrderSummaryContainerProps = {
	inThreeTier: boolean;
	renderOrderSummary: (props: ContributionsOrderSummaryProps) => JSX.Element;
};

function getTermsConditions(
	contributionType: ContributionType,
	isSupporterPlus: boolean,
) {
	if (contributionType === 'ONE_OFF') return;
	const period = contributionType === 'MONTHLY' ? 'month' : 'year';

	if (isSupporterPlus) {
		return (
			<>
				<p>Auto renews every {period} until you cancel.</p>
				<p>
					Cancel or change your support anytime. If you cancel within the first
					14 days, you will receive a full refund.
				</p>
			</>
		);
	}
	return (
		<>
			<p>Auto renews every {period} until you cancel.</p>
			<p>Cancel or change your support anytime.</p>
		</>
	);
}

export function ContributionsOrderSummaryContainer({
	inThreeTier,
	renderOrderSummary,
}: ContributionsOrderSummaryContainerProps): JSX.Element {
	const contributionType = useContributionsSelector(getContributionType);

	const { currencyId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);
	const currency = currencies[currencyId];

	const isSupporterPlus = useContributionsSelector(isSupporterPlusFromState);
	const promoPrice = useContributionsSelector((state) =>
		isSupporterPlus
			? getLowerBenefitsThreshold(
					state,
					contributionType as RegularContributionType,
			  )
			: getUserSelectedAmount(state),
	);
	const price = useContributionsSelector((state) =>
		getAmount(
			state.page.checkoutForm.product.selectedAmounts,
			state.page.checkoutForm.product.otherAmounts,
			contributionType,
		),
	);
	const isPromoApplied = price > promoPrice;

	const checklist =
		contributionType === 'ONE_OFF'
			? []
			: checkListData({
					higherTier: isSupporterPlus,
			  });

	function onCheckListToggle(isOpen: boolean) {
		trackComponentClick(
			`contribution-order-summary-${isOpen ? 'opened' : 'closed'}`,
		);
	}

	const threeTierProductName = (
		contributionType: ContributionType,
	): string | undefined => {
		if (inThreeTier) {
			if (contributionType === 'ONE_OFF') {
				return 'One-time support';
			} else if (isSupporterPlus) {
				return 'All-access digital';
			} else {
				return 'Support';
			}
		}
	};

	const description = threeTierProductName(contributionType) ?? '';
	const paymentFrequency =
		contributionType === 'MONTHLY'
			? 'month'
			: contributionType === 'ANNUAL'
			? 'year'
			: '';

	return renderOrderSummary({
		description,
		total: promoPrice,
		totalExcludingPromo: isSupporterPlus && isPromoApplied ? price : undefined,
		currency,
		paymentFrequency,
		enableCheckList: contributionType !== 'ONE_OFF',
		checkListData: checklist,
		onCheckListToggle,
		threeTierProductName: threeTierProductName(contributionType),
		tsAndCs: getTermsConditions(contributionType, isSupporterPlus),
	});
}
