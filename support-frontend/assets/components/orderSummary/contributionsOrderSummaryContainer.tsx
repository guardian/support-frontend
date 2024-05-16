import { checkListData } from 'components/checkoutBenefits/checkoutBenefitsListData';
import { type ContributionType, getAmount } from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { currencies } from 'helpers/internationalisation/currency';
import { supporterPlusLegal } from 'helpers/legalCopy';
import type { Promotion } from 'helpers/productPrice/promotions';
import { isSupporterPlusFromState } from 'helpers/redux/checkout/product/selectors/isSupporterPlus';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import { useContributionsSelector } from 'helpers/redux/storeHooks';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import type { ContributionsOrderSummaryProps } from './contributionsOrderSummary';

type ContributionsOrderSummaryContainerProps = {
	inThreeTier: boolean;
	renderOrderSummary: (props: ContributionsOrderSummaryProps) => JSX.Element;
	promotion?: Promotion;
};

function getTermsConditions(
	countryGroupId: CountryGroupId,
	contributionType: ContributionType,
	isSupporterPlus: boolean,
	promotion?: Promotion,
) {
	if (contributionType === 'ONE_OFF') return;
	const period = contributionType === 'MONTHLY' ? 'month' : 'year';

	if (isSupporterPlus) {
		return (
			<>
				{promotion && (
					<p>
						You’ll pay{' '}
						{supporterPlusLegal(
							countryGroupId,
							contributionType,
							'/',
							promotion,
						)}{' '}
						afterwards unless you cancel. Offer only available to new
						subscribers who do not have an existing subscription with the
						Guardian.
					</p>
				)}
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
			  });

	function onCheckListToggle(isOpen: boolean) {
		console.log('TEST trackComponentClick-contributionsOrderSummaryContainer');
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
		amount: amount,
		promotion,
		currency,
		paymentFrequency,
		enableCheckList: contributionType !== 'ONE_OFF',
		checkListData: checklist,
		onCheckListToggle,
		threeTierProductName: threeTierProductName(contributionType),
		tsAndCs: getTermsConditions(
			countryGroupId,
			contributionType,
			isSupporterPlus,
			promotion,
		),
	});
}
