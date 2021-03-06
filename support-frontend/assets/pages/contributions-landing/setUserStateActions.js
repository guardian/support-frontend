// @flow
import { defaultUserActionFunctions } from 'helpers/user/defaultUserActionFunctions';
import { setFormSubmissionDependentValue } from './checkoutFormIsSubmittableActions';
import type { UserSetStateActions } from 'helpers/user/userActions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { stateProvinceFieldFromString } from 'helpers/internationalisation/country';


// ----- Actions Creators ----- //

const setIsSignedIn = (isSignedIn: boolean): ((Function) => void) =>
  (dispatch: Function): void => {
    dispatch(setFormSubmissionDependentValue(() => ({ type: 'SET_IS_SIGNED_IN', isSignedIn })));
  };

const setIsRecurringContributor = (): ((Function) => void) =>
  (dispatch: Function): void => {
    dispatch(setFormSubmissionDependentValue(() => ({ type: 'SET_IS_RECURRING_CONTRIBUTOR' })));
  };

const setStateFieldSafely = (pageCountryGroupId: CountryGroupId) =>
  (unsafeState: string): ((Function) => void) =>
    (dispatch: Function): void => {
      const stateField = stateProvinceFieldFromString(pageCountryGroupId, unsafeState);
      if (stateField) {
        dispatch(setFormSubmissionDependentValue(() => ({ type: 'SET_STATEFIELD', stateField })));
      }
    };

const setUserStateActions = (countryGroupId: CountryGroupId): UserSetStateActions => {
  const setStateField = setStateFieldSafely(countryGroupId);
  return {
    ...defaultUserActionFunctions,
    setIsSignedIn,
    setIsRecurringContributor,
    setStateField,
  };
};

export { setUserStateActions };
