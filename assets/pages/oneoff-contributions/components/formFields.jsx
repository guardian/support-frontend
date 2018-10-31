// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import TextInput from 'components/textInput/textInput';
import {
  setFullName,
  setEmail,
  type Action as UserAction,
} from 'helpers/user/userActions';
import {
  type UserFormFieldAttribute,
  shouldShowError,
  emailRegexPattern,
} from 'helpers/checkoutForm/checkoutForm';
import { type Action as CheckoutAction } from '../helpers/checkoutForm/checkoutFormActions';
import { getFormFields } from '../helpers/checkoutForm/checkoutFormFieldsSelector';
import { type State } from '../oneOffContributionsReducer';


// ----- Types ----- //

type PropTypes = {|
  fullName: UserFormFieldAttribute,
  email: UserFormFieldAttribute,
  setFullName: (string) => void,
  setEmail: (string) => void,
  isSignedIn: boolean,
  checkoutFormHasBeenSubmitted: boolean,
|};

// ----- Map State/Props ----- //

function mapStateToProps(state: State) {

  const { fullName, email } = getFormFields(state);

  return {
    fullName,
    email,
    isSignedIn: state.page.user.isSignedIn,
    checkoutFormHasBeenSubmitted: state.page.checkoutForm.checkoutFormHasBeenSubmitted,
  };

}

function mapDispatchToProps(dispatch: Dispatch<UserAction | CheckoutAction>) {

  return {
    setFullName: (fullName: string) => {
      dispatch(setFullName(fullName));
    },
    setEmail: (email: string) => {
      dispatch(setEmail(email));
    },
  };
}

export const formClassName = 'oneoff-contrib__checkout-form';

// ----- Component ----- //

function NameForm(props: PropTypes) {
  return (
    <form className={formClassName}>
      {
        !props.isSignedIn ? (
          <TextInput
            id="email"
            value={props.email.value}
            labelText="Email"
            placeholder="Email"
            onChange={props.setEmail}
            modifierClasses={['email']}
            showError={shouldShowError(props.email, props.checkoutFormHasBeenSubmitted)}
            errorMessage="Please enter a valid email address."
            type="email"
            pattern={emailRegexPattern}
            required
          />
        ) : null
      }
      <TextInput
        id="name"
        placeholder="Full name"
        labelText="Full name"
        value={props.fullName.value}
        onChange={props.setFullName}
        modifierClasses={['name']}
        showError={shouldShowError(props.fullName, props.checkoutFormHasBeenSubmitted)}
        errorMessage="Please enter your name."
        required
      />
      <p className="component-your-details__info">
        <small>All fields are required.</small>
      </p>
    </form>
  );
}

// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(NameForm);
