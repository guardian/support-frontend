import { checkListData } from 'components/checkoutBenefits/checkoutBenefitsListData';
import { simpleFormatAmount } from 'helpers/forms/checkouts';
import { currencies } from 'helpers/internationalisation/currency';
import { isSupporterPlusPurchase } from 'helpers/redux/checkout/product/selectors/isSupporterPlus';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import { getUserSelectedAmount } from 'helpers/redux/checkout/product/selectors/selectedAmount';
import { useContributionsSelector } from 'helpers/redux/storeHooks';
import type { ContributionsOrderSummaryProps } from './contributionsOrderSummary';

type ContributionsOrderSummaryContainerProps = {
	renderOrderSummary: (props: ContributionsOrderSummaryProps) => JSX.Element;
};

export function ContributionsOrderSummaryContainer({
	renderOrderSummary,
}: ContributionsOrderSummaryContainerProps): JSX.Element {
	const contributionType = useContributionsSelector(getContributionType);

	const { currencyId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);
	const selectedAmount = useContributionsSelector(getUserSelectedAmount);
	const isSupporterPlus = useContributionsSelector(isSupporterPlusPurchase);

	const currency = currencies[currencyId];
	const userSelectedAmountWithCurrency = simpleFormatAmount(
		currency,
		selectedAmount,
	);

	const checklist =
		contributionType === 'ONE_OFF'
			? []
			: checkListData({
					higherTier: isSupporterPlus,
			  });

	return renderOrderSummary({
		contributionType,
		total: userSelectedAmountWithCurrency,
		checkListData: checklist,
	});
}
