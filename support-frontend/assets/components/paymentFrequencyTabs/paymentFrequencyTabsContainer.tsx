import { toHumanReadableContributionType } from 'helpers/forms/checkouts';
import { setProductType } from 'helpers/redux/checkout/product/actions';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import type {
	PaymentFrequencyTabsRenderProps,
	TabProps,
} from './paymentFrequenncyTabs';

type PaymentFrequencyTabsContainerProps = {
	ariaLabel?: string;
	render: (tabComponentProps: PaymentFrequencyTabsRenderProps) => JSX.Element;
};

export function PaymentFrequencyTabsContainer({
	ariaLabel = 'Payment frequency options',
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
		ariaLabel,
		tabs,
		selectedTab: productType,
		onTabChange: (tabId) => dispatch(setProductType(tabId)),
	});
}
