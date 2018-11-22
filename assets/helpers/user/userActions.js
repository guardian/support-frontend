// @flow

// ----- Types ----- //
export type Action =
  | { type: 'SET_USER_ID', id: string }
  | { type: 'SET_DISPLAY_NAME', name: string }
  | { type: 'SET_FIRST_NAME', name: string }
  | { type: 'SET_LAST_NAME', name: string }
  | { type: 'SET_FULL_NAME', name: string }
  | { type: 'SET_EMAIL', email: string }
  | { type: 'SET_STATEFIELD', stateField: string }
  | { type: 'SET_TEST_USER', testUser: boolean }
  | { type: 'SET_IS_RECURRING_CONTRIBUTOR' }
  | { type: 'SET_POST_DEPLOYMENT_TEST_USER', postDeploymentTestUser: boolean }
  | { type: 'SET_GNM_MARKETING', preference: boolean }
  | { type: 'SET_IS_SIGNED_IN', isSignedIn: boolean };

export type UserSetStateActions = {
  setId: string => Action,
  setDisplayName: string => Action,
  setFirstName: string => Action,
  setLastName: string => Action,
  setFullName: string => Action,
  setEmail: string => Action,
  setStateField: string => Action,
  setTestUser: boolean => Action,
  setPostDeploymentTestUser: boolean => Action,
  setGnmMarketing: boolean => Action,

  // When we change either of these in the context of the contributions landing page,
  // we need to dispatch some additional actions to update some state in the
  // contributions landing page state as well as update the user state, hence the union type.
  setIsSignedIn: boolean => (Action | (Function => void)),
  setIsRecurringContributor: () => (Action | (Function => void)),
}
