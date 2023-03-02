import type { CheckoutBenefitsListProps } from 'components/checkoutBenefits/checkoutBenefitsList';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import { getSubscriptionPriceForBillingPeriod } from 'helpers/redux/checkout/product/selectors/subscriptionPrice';
import { useContributionsSelector } from 'helpers/redux/storeHooks';
import { checkListData } from './subscriptionBenefitsListData';

type CheckoutBenefitsListContainerProps = {
	renderBenefitsList: (props: CheckoutBenefitsListProps) => JSX.Element;
};

function getBenefitsListTitle(
	priceString: string,
	billingPeriod: BillingPeriod,
) {
	const interval = billingPeriod === 'Monthly' ? 'month' : 'year';
	return `For ${priceString} per ${interval}, you’ll unlock`;
}

export function KindleSubscriptionBenefitsListContainer({
	renderBenefitsList,
}: CheckoutBenefitsListContainerProps): JSX.Element | null {
	const { billingPeriod } = useContributionsSelector(
		(state) => state.page.checkoutForm.product,
	);

	const { countryGroupId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);
	const priceString = useContributionsSelector(
		getSubscriptionPriceForBillingPeriod,
	);

	return renderBenefitsList({
		title: getBenefitsListTitle(priceString, billingPeriod),
		checkListData: checkListData(),
		buttonCopy: null,
		handleButtonClick: () => undefined,
		countryGroupId,
	});
}
