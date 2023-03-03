import type { CheckoutBenefitsListProps } from 'components/checkoutBenefits/checkoutBenefitsList';
import { useContributionsSelector } from 'helpers/redux/storeHooks';
import { checkListData } from './subscriptionBenefitsListData';

type CheckoutBenefitsListContainerProps = {
	renderBenefitsList: (props: CheckoutBenefitsListProps) => JSX.Element;
};

export function KindleSubscriptionBenefitsListContainer({
	renderBenefitsList,
}: CheckoutBenefitsListContainerProps): JSX.Element | null {
	const { countryGroupId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);

	return renderBenefitsList({
		title: '',
		checkListData: checkListData(),
		buttonCopy: null,
		handleButtonClick: () => undefined,
		countryGroupId,
	});
}
