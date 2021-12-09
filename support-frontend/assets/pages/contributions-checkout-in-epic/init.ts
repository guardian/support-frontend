import type { Store } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import type { ContributionAmounts } from 'helpers/contributions';
import type { Action } from 'pages/contributions-landing/contributionsLandingActions';
import { selectAmounts } from 'pages/contributions-landing/contributionsLandingActions';
import type { State } from 'pages/contributions-landing/contributionsLandingReducer';

// ---- Init ---- //

export function init(store: Store<State, Action>): void {
	const { dispatch } = store;
	const state = store.getState();

	selectInitialAmounts(dispatch, state.common.amounts);
}

// ---- Helpers ---- //

function selectInitialAmounts(
	dispatch: ThunkDispatch<State, void, Action>,
	amounts: ContributionAmounts,
) {
	// Here we select the second amounts in the 'amounts' arrays as the default amounts.
	// The choice cards just show the first two amounts configured in the tool
	// and an 'other' option. This means the 'defaultAmount' configured in the tool
	// might not be present.
	dispatch(
		selectAmounts({
			ONE_OFF: amounts.ONE_OFF.amounts[1],
			MONTHLY: amounts.MONTHLY.amounts[1],
			ANNUAL: amounts.ANNUAL.amounts[1],
		}),
	);
}
