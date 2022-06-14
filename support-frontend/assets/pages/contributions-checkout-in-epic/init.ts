import type { ContributionAmounts } from 'helpers/contributions';
import { setAllAmounts } from 'helpers/redux/checkout/product/actions';
import type {
	ContributionsDispatch,
	ContributionsStore,
} from 'helpers/redux/contributionsStore';

// ---- Init ---- //

export function init(store: ContributionsStore): void {
	const { dispatch } = store;
	const state = store.getState();

	selectInitialAmounts(dispatch, state.common.amounts);
}

// ---- Helpers ---- //

function selectInitialAmounts(
	dispatch: ContributionsDispatch,
	amounts: ContributionAmounts,
) {
	// Here we select the second amounts in the 'amounts' arrays as the default amounts.
	// The choice cards just show the first two amounts configured in the tool
	// and an 'other' option. This means the 'defaultAmount' configured in the tool
	// might not be present.
	dispatch(
		setAllAmounts({
			ONE_OFF: amounts.ONE_OFF.amounts[1],
			MONTHLY: amounts.MONTHLY.amounts[1],
			ANNUAL: amounts.ANNUAL.amounts[1],
		}),
	);
}
