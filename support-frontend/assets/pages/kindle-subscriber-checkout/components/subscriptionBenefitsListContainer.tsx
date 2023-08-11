import type { CheckoutBenefitsListProps } from 'components/checkoutBenefits/checkoutBenefitsList';
import { checkListData } from './subscriptionBenefitsListData';

type CheckoutBenefitsListContainerProps = {
	renderBenefitsList: (props: CheckoutBenefitsListProps) => JSX.Element;
};

export function KindleSubscriptionBenefitsListContainer({
	renderBenefitsList,
}: CheckoutBenefitsListContainerProps): JSX.Element | null {
	return renderBenefitsList({
		title: '',
		checkListData: checkListData(),
		buttonCopy: null,
		handleButtonClick: () => undefined,
	});
}
