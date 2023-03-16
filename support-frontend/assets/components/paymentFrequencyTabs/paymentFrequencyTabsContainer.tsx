import type { Participations } from 'helpers/abTests/abtest';
import type { ContributionType } from 'helpers/contributions';
import {
	getPaymentMethodToSelect,
	toHumanReadableContributionType,
} from 'helpers/forms/checkouts';
import { setPaymentMethod } from 'helpers/redux/checkout/payment/paymentMethod/actions';
import { setProductType } from 'helpers/redux/checkout/product/actions';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import type {
	PaymentFrequencyTabsRenderProps,
	TabProps,
} from './paymentFrequenncyTabs';

type PaymentFrequencyTabsContainerProps = {
	participations: Participations;
	ariaLabel?: string;
	render: (tabComponentProps: PaymentFrequencyTabsRenderProps) => JSX.Element;
};

export function PaymentFrequencyTabsContainer({
	participations,
	ariaLabel = 'Payment frequency options',
	render,
}: PaymentFrequencyTabsContainerProps): JSX.Element {
	const dispatch = useContributionsDispatch();
	const { contributionTypes, switches } = useContributionsSelector(
		(state) => state.common.settings,
	);
	const { countryGroupId, countryId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);
	const productType = useContributionsSelector(getContributionType);

	function onTabChange(contributionType: ContributionType) {
		const paymentMethodToSelect = getPaymentMethodToSelect(
			contributionType,
			switches,
			countryId,
			countryGroupId,
		);

		trackComponentClick(
			`npf-contribution-type-toggle-${countryGroupId}-${contributionType}`,
		);

		dispatch(setProductType(contributionType));
		dispatch(setPaymentMethod(paymentMethodToSelect));
	}

	const tabs: TabProps[] = contributionTypes[countryGroupId].map(
		({ contributionType }) => {
			return {
				id: contributionType,
				labelText: toHumanReadableContributionType(contributionType),
				selected: contributionType === productType,
			};
		},
	);

	if (
		participations.singleLessProminent === 'variant' &&
		(productType === 'MONTHLY' || productType === 'ANNUAL')
	) {
		delete tabs[0];
	}

	return render({
		ariaLabel,
		tabs,
		selectedTab: productType,
		onTabChange,
	});
}
