// @flow
import { defaultUserActionFunctions } from 'helpers/user/defaultUserActionFunctions';
import { setFormSubmissionDependentValue } from './checkoutFormIsSubmittableActions';

// ----- Actions Creators ----- //

const setIsSignedIn = (isSignedIn: boolean): ((Function) => void) =>
  (dispatch: Function): void => {
    dispatch(setFormSubmissionDependentValue(() => ({ type: 'SET_IS_SIGNED_IN', isSignedIn })));
  };

const setIsRecurringContributor = (): ((Function) => void) =>
  (dispatch: Function): void => {
    dispatch(setFormSubmissionDependentValue(() => ({ type: 'SET_IS_RECURRING_CONTRIBUTOR' })));
  };

const setUserStateActions = {
  ...defaultUserActionFunctions,
  setIsSignedIn,
  setIsRecurringContributor,
};

export { setUserStateActions };
