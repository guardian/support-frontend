// ----- Types ----- //
export type Action = {
  type: "SET_USER_ID";
  id: string;
} | {
  type: "SET_DISPLAY_NAME";
  name: string;
} | {
  type: "SET_FIRST_NAME";
  name: string;
} | {
  type: "SET_LAST_NAME";
  name: string;
} | {
  type: "SET_FULL_NAME";
  name: string;
} | {
  type: "SET_EMAIL";
  email: string;
} | {
  type: "SET_STATEFIELD";
  stateField: string;
} | {
  type: "SET_TEST_USER";
  testUser: boolean;
} | {
  type: "SET_IS_RECURRING_CONTRIBUTOR";
} | {
  type: "SET_POST_DEPLOYMENT_TEST_USER";
  postDeploymentTestUser: boolean;
} | {
  type: "SET_GNM_MARKETING";
  preference: boolean;
} | {
  type: "SET_IS_SIGNED_IN";
  isSignedIn: boolean;
} | {
  type: "SET_EMAIL_VALIDATED";
  emailValidated: boolean;
} | {
  type: "SET_IS_RETURNING_CONTRIBUTOR";
  isReturningContributor: boolean;
};
export type UserSetStateActions = {
  setId: (arg0: string) => Action;
  setDisplayName: (arg0: string) => Action;
  setFirstName: (arg0: string) => Action;
  setLastName: (arg0: string) => Action;
  setFullName: (arg0: string) => Action;
  setEmail: (arg0: string) => Action;
  setTestUser: (arg0: boolean) => Action;
  setPostDeploymentTestUser: (arg0: boolean) => Action;
  setGnmMarketing: (arg0: boolean) => Action;
  setEmailValidated: (arg0: boolean) => Action;
  setIsReturningContributor: (arg0: boolean) => Action;
  // When we change either of these in the context of the contributions landing page,
  // we need to dispatch some additional actions to update some state in the
  // contributions landing page state as well as update the user state, hence the union type.
  setIsSignedIn: (arg0: boolean) => Action | ((arg0: (...args: Array<any>) => any) => void);
  setIsRecurringContributor: () => Action | ((arg0: (...args: Array<any>) => any) => void);
  setStateField: (arg0: string) => Action | ((arg0: (...args: Array<any>) => any) => void);
};