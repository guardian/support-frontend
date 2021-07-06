import { defaultUserActionFunctions } from "../defaultUserActionFunctions";
jest.mock('ophan', () => () => ({}));
describe('actions', () => {
  const {
    setDisplayName,
    setFirstName,
    setLastName,
    setFullName,
    setIsSignedIn,
    setEmail,
    setTestUser,
    setPostDeploymentTestUser,
    setGnmMarketing,
    setStateField,
    setIsReturningContributor,
    setEmailValidated
  } = defaultUserActionFunctions;
  it('should create SET_DISPLAY_NAME action', () => {
    const name: string = 'My Name';
    const expectedAction = {
      type: 'SET_DISPLAY_NAME',
      name
    };
    expect(setDisplayName(name)).toEqual(expectedAction);
  });
  it('should create SET_FIRST_NAME action', () => {
    const name: string = 'John';
    const expectedAction = {
      type: 'SET_FIRST_NAME',
      name
    };
    expect(setFirstName(name)).toEqual(expectedAction);
  });
  it('should create SET_LAST_NAME action', () => {
    const name: string = 'Doe';
    const expectedAction = {
      type: 'SET_LAST_NAME',
      name
    };
    expect(setLastName(name)).toEqual(expectedAction);
  });
  it('should create SET_FULL_NAME action', () => {
    const name: string = 'John Doe';
    const expectedAction = {
      type: 'SET_FULL_NAME',
      name
    };
    expect(setFullName(name)).toEqual(expectedAction);
  });
  it('should create SET_EMAIL action', () => {
    const email: string = 'johndoe@example.com';
    const expectedAction = {
      type: 'SET_EMAIL',
      email
    };
    expect(setEmail(email)).toEqual(expectedAction);
  });
  it('should create SET_STATEFIELD action', () => {
    const stateField: string = 'CA';
    const expectedAction = {
      type: 'SET_STATEFIELD',
      stateField
    };
    expect(setStateField(stateField)).toEqual(expectedAction);
  });
  it('should create SET_TEST_USER action', () => {
    const testUser: boolean = true;
    const expectedAction = {
      type: 'SET_TEST_USER',
      testUser
    };
    expect(setTestUser(testUser)).toEqual(expectedAction);
  });
  it('should create SET_POST_DEPLOYMENT_TEST_USER action', () => {
    const postDeploymentTestUser: boolean = true;
    const expectedAction = {
      type: 'SET_POST_DEPLOYMENT_TEST_USER',
      postDeploymentTestUser
    };
    expect(setPostDeploymentTestUser(postDeploymentTestUser)).toEqual(expectedAction);
  });
  it('should create SET_GNM_MARKETING action', () => {
    const preference: boolean = false;
    const expectedAction = {
      type: 'SET_GNM_MARKETING',
      preference
    };
    expect(setGnmMarketing(preference)).toEqual(expectedAction);
  });
  it('should create SET_IS_SIGNED_IN action', () => {
    const isSignedIn: boolean = true;
    const expectedAction = {
      type: 'SET_IS_SIGNED_IN',
      isSignedIn
    };
    expect(setIsSignedIn(isSignedIn)).toEqual(expectedAction);
  });
  it('should create SET_EMAIL_VALIDATED action', () => {
    const emailValidated: boolean = true;
    const expectedAction = {
      type: 'SET_EMAIL_VALIDATED',
      emailValidated
    };
    expect(setEmailValidated(emailValidated)).toEqual(expectedAction);
  });
  it('should create SET_IS_RETURNING_CONTRIBUTOR action', () => {
    const isReturningContributor: boolean = true;
    const expectedAction = {
      type: 'SET_IS_RETURNING_CONTRIBUTOR',
      isReturningContributor
    };
    expect(setIsReturningContributor(isReturningContributor)).toEqual(expectedAction);
  });
});