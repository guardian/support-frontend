import { toHumanReadableContributionType } from 'helpers/forms/checkouts';
import { setProductType } from 'helpers/redux/checkout/product/actions';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import type {
	PaymentFrequencyTabsProps,
	TabProps,
} from './paymentFrequenncyTabs';

type PaymentFrequencyTabsRenderProps = Omit<
	PaymentFrequencyTabsProps,
	'TabController' | 'renderTabContent'
>;

type PaymentFrequencyTabsContainerProps = {
	render: (tabComponentProps: PaymentFrequencyTabsRenderProps) => JSX.Element;
};

export function PaymentFrequencyTabsContainer({
	render,
}: PaymentFrequencyTabsContainerProps): JSX.Element {
	const dispatch = useContributionsDispatch();
	const { contributionTypes } = useContributionsSelector(
		(state) => state.common.settings,
	);
	const { countryGroupId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);
	const productType = useContributionsSelector(getContributionType);

	const tabs: TabProps[] = contributionTypes[countryGroupId].map(
		({ contributionType }) => {
			return {
				id: contributionType,
				labelText: toHumanReadableContributionType(contributionType),
				selected: contributionType === productType,
			};
		},
	);

	return render({
		ariaLabel: 'Payment frequency',
		tabs,
		selectedTab: productType,
		onTabChange: (tabId) => dispatch(setProductType(tabId)),
	});
}
