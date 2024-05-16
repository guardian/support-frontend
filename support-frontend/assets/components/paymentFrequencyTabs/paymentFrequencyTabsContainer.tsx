import type { ContributionType } from 'helpers/contributions';
import { toHumanReadableContributionType } from 'helpers/forms/checkouts';
import { setProductType } from 'helpers/redux/checkout/product/actions';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import type { PaymentFrequencyTabsRenderProps } from './paymentFrequenncyTabs';

type PaymentFrequencyTabsContainerProps = {
	ariaLabel?: string;
	render: (tabComponentProps: PaymentFrequencyTabsRenderProps) => JSX.Element;
};

export function PaymentFrequencyTabsContainer({
	ariaLabel = 'Payment frequency options',
	render,
}: PaymentFrequencyTabsContainerProps): JSX.Element {
	const dispatch = useContributionsDispatch();

	const { displayContributionType } = useContributionsSelector(
		(state) => state.common.amounts,
	);
	const { countryGroupId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);
	const productType = useContributionsSelector(getContributionType);

	function onTabChange(contributionType: ContributionType) {
		console.log('TEST trackComponentClick-paymntFrquencyTabsContainer');
		trackComponentClick(
			`npf-contribution-type-toggle-${countryGroupId}-${contributionType}`,
		);

		dispatch(setProductType(contributionType));
	}
	const tabs = displayContributionType.map((contributionType) => {
		return {
			id: contributionType,
			labelText: toHumanReadableContributionType(contributionType),
			selected: contributionType === productType,
		};
	});
	return render({
		ariaLabel,
		tabs,
		selectedTab: productType,
		onTabChange,
	});
}
