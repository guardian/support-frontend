import type {
	AmountsTest,
	AmountsTests,
	ContributionType,
} from 'helpers/contributions';
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

////////
const getSpecifiedRegionAmountsTest = (
	target: string,
	amounts: AmountsTests | undefined,
): AmountsTest | Record<string, never> => {
	if (!amounts) {
		return {};
	}
	const testArray = amounts.filter(
		(t) =>
			t.targeting.targetingType === 'Region' && t.targeting.region === target,
	);
	if (!testArray.length) {
		return {};
	}
	return testArray[0];
};
//////

export function PaymentFrequencyTabsContainer({
	ariaLabel = 'Payment frequency options',
	render,
}: PaymentFrequencyTabsContainerProps): JSX.Element {
	const dispatch = useContributionsDispatch();
	const { amounts } = useContributionsSelector(
		(state) => state.common.settings,
	);
	const { countryGroupId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);

	const contributionTypesForSpecificRegions = getSpecifiedRegionAmountsTest(
		countryGroupId,
		amounts,
	);

	const productType = useContributionsSelector(getContributionType);

	function onTabChange(contributionType: ContributionType) {
		trackComponentClick(
			`npf-contribution-type-toggle-${countryGroupId}-${contributionType}`,
		);

		dispatch(setProductType(contributionType));
	}

	const tabs =
		contributionTypesForSpecificRegions.variants[0].displayContributionType.map(
			(contributionType) => {
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
		onTabChange,
	});
}
