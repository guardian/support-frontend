import type { ThunkDispatch } from 'redux-thunk';
import { stateProvinceFieldFromString } from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { ContributionsState } from 'helpers/redux/contributionsStore';
import { defaultUserActionFunctions } from 'helpers/user/defaultUserActionFunctions';
import type { Action, UserSetStateActions } from 'helpers/user/userActions';

// ----- Actions Creators ----- //
// This action creator seems to be overridden in order to prevent setting an invalid string as the user's state
// as we get this from window.guardian - see helpers/user/user.ts#140 on
// It would make more sense to put this logic in the reducer itself when we refactor to RTK
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
		setStateField,
	};
};

export { setUserStateActions };
