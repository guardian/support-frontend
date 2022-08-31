import type { ReactNode } from 'react';
import type { ContributionType } from 'helpers/contributions';
import { toHumanReadableContributionType } from 'helpers/forms/checkouts';
import { setProductType } from 'helpers/redux/checkout/product/actions';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import type { TabProps } from './paymentFrequenncyTabs';
import { PaymentFrequencyTabs } from './paymentFrequenncyTabs';

type PaymentFrequencyTabsContainerProps = {
	tabContent: (selectedTab: ContributionType) => ReactNode;
};

export function PaymentFrequencyTabsContainer({
	tabContent,
}: PaymentFrequencyTabsContainerProps): JSX.Element {
	const dispatch = useContributionsDispatch();
	const { contributionTypes } = useContributionsSelector(
		(state) => state.common.settings,
	);
	const { countryGroupId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);
	const { productType } = useContributionsSelector(
		(state) => state.page.checkoutForm.product,
	);

	const tabs: TabProps[] = contributionTypes[countryGroupId].map(
		({ contributionType }) => {
			return {
				id: contributionType,
				text: toHumanReadableContributionType(contributionType),
				selected: contributionType === productType,
				content: tabContent(contributionType),
			};
		},
	);

	return (
		<PaymentFrequencyTabs
			ariaLabel="Payment frequency"
			tabs={tabs}
			onTabChange={(tabId) => dispatch(setProductType(tabId))}
		/>
	);
}
