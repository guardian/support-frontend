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

  it('should handle SET_FIRST_NAME_SHOULD_VALIDATE', () => {
    const action = { type: 'SET_FIRST_NAME_SHOULD_VALIDATE' };

    const newState = reducer(undefined, action);

    expect(newState.firstName.shouldValidate).toEqual(true);
  });

  it('should handle SET_LAST_NAME_SHOULD_VALIDATE', () => {
    const action = { type: 'SET_LAST_NAME_SHOULD_VALIDATE' };

    const newState = reducer(undefined, action);

    expect(newState.lastName.shouldValidate).toEqual(true);
  });


});
