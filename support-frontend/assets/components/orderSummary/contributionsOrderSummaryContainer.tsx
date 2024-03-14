import { checkListData } from 'components/checkoutBenefits/checkoutBenefitsListData';
import type { ContributionType } from 'helpers/contributions';
import { currencies } from 'helpers/internationalisation/currency';
import { isSupporterPlusFromState } from 'helpers/redux/checkout/product/selectors/isSupporterPlus';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import { getUserSelectedAmount } from 'helpers/redux/checkout/product/selectors/selectedAmount';
import { useContributionsSelector } from 'helpers/redux/storeHooks';
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
	const selectedAmount = useContributionsSelector(getUserSelectedAmount);
	const isSupporterPlus = useContributionsSelector(isSupporterPlusFromState);

	const currency = currencies[currencyId];

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

	const threeTierProductName = (): string | undefined => {
		if (inThreeTier) {
			if (isSupporterPlus) {
				return 'All-access digital';
			} else {
				return 'Support';
			}
		}
	};

	let description;
	let paymentFrequency;
	if (contributionType === 'ONE_OFF') {
		description = 'One-time support';
	} else if (contributionType === 'MONTHLY') {
		description = 'Monthly support';
		paymentFrequency = 'month';
	} else {
		// The if (contributionType === 'ANNUAL') condition would be here
		// but typescript errors on it being unnecessary due to it always being truthy
		description = 'Annual support';
		paymentFrequency = 'year';
	}

	return renderOrderSummary({
		description,
		total: selectedAmount,
		currency: currency,
		paymentFrequency,
		enableCheckList: contributionType !== 'ONE_OFF',
		checkListData: checklist,
		onCheckListToggle,
		threeTierProductName: threeTierProductName(),
		tsAndCs: getTermsConditions(contributionType, isSupporterPlus),
	});
}
