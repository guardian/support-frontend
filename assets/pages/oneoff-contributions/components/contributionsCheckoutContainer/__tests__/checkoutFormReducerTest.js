import { checkoutFormReducer as reducer } from '../checkoutFormReducer';

// ----- Tests ----- //

describe('user reducer tests', () => {

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toMatchSnapshot();
  });

  it('should handle SET_EMAIL_SHOULD_VALIDATE', () => {
    const action = { type: 'SET_EMAIL_SHOULD_VALIDATE' };

    const newState = reducer(undefined, action);

    expect(newState.email.shouldValidate).toEqual(true);
  });

  it('should handle SET_FULL_NAME_SHOULD_VALIDATE', () => {
    const action = { type: 'SET_FULL_NAME_SHOULD_VALIDATE' };

    const newState = reducer(undefined, action);

    expect(newState.fullName.shouldValidate).toEqual(true);
  });

});
