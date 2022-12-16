import type { ThunkDispatch } from 'redux-thunk';
import { stateProvinceFieldFromString } from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { ContributionsState } from 'helpers/redux/contributionsStore';
import { defaultUserActionFunctions } from 'helpers/user/defaultUserActionFunctions';
import type { Action, UserSetStateActions } from 'helpers/user/userActions';

// ----- Actions Creators ----- //
const setIsSignedIn =
	(isSignedIn: boolean) =>
	(dispatch: ThunkDispatch<ContributionsState, void, Action>) => {
		dispatch({
			type: 'SET_IS_SIGNED_IN',
			isSignedIn,
		});
	};

const setIsRecurringContributor =
	() =>
	(dispatch: ThunkDispatch<ContributionsState, void, Action>): void => {
		dispatch({
			type: 'SET_IS_RECURRING_CONTRIBUTOR',
		});
	};

const setStateFieldSafely =
	(pageCountryGroupId: CountryGroupId) =>
	(unsafeState: string) =>
	(dispatch: ThunkDispatch<ContributionsState, void, Action>): void => {
		const stateField = stateProvinceFieldFromString(
			pageCountryGroupId,
			unsafeState,
		);

		if (stateField) {
			dispatch({
				type: 'SET_STATEFIELD',
				stateField,
			});
		}
	};

const setUserStateActions = (
	countryGroupId: CountryGroupId,
): UserSetStateActions => {
	const setStateField = setStateFieldSafely(countryGroupId);
	return {
		...defaultUserActionFunctions,
		setIsSignedIn,
		setIsRecurringContributor,
		setStateField,
	};
};

export { setUserStateActions };
