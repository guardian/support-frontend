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
  onFormFieldBlur,
} from 'helpers/checkoutForm/checkoutForm';
import {
  type Action as CheckoutAction,
  setFullNameShouldValidate,
  setEmailShouldValidate,
} from '../helpers/checkoutForm/checkoutFormActions';
import { getFormFields } from '../helpers/checkoutForm/checkoutFormFieldsSelector';
import { type PageState as State } from '../oneOffContributionsReducer';


// ----- Types ----- //

type PropTypes = {
  fullName: UserFormFieldAttribute,
  email: UserFormFieldAttribute,
  setFullName: (string) => void,
  setEmail: (string) => void,
  setFullNameShouldValidate: () => void,
  setEmailShouldValidate: () => void,
};

// ----- Map State/Props ----- //

function mapStateToProps(state: State) {

  const { fullName, email } = getFormFields(state);

  return {
    fullName,
    email,
  };

}

function mapDispatchToProps(dispatch: Dispatch<UserAction | CheckoutAction>) {

  return {
    setFullNameShouldValidate: () => {
      dispatch(setFullNameShouldValidate());
    },
    setFullName: (fullName: string) => {
      dispatch(setFullName(fullName));
    },
    setEmailShouldValidate: () => {
      dispatch(setEmailShouldValidate());
    },
    setEmail: (email: string) => {
      dispatch(setEmail(email));
    },
  };
}

// ----- Component ----- //

function NameForm(props: PropTypes) {
  const stripeButtonClassName = 'component-stripe-pop-up-button';

  return (
    <form className="oneoff-contrib__name-form">
      <TextInput
        id="email"
        value={props.email.value}
        labelText="Email"
        placeholder="Email"
        onChange={props.setEmail}
        onBlur={onFormFieldBlur(props.setEmailShouldValidate, stripeButtonClassName)}
        modifierClasses={['email']}
        showError={shouldShowError(props.email)}
        errorMessage="Please enter a valid email address."
      />
      <TextInput
        id="name"
        placeholder="Full name"
        labelText="Full name"
        value={props.fullName.value}
        onChange={props.setFullName}
        onBlur={onFormFieldBlur(props.setFullNameShouldValidate, stripeButtonClassName)}
        modifierClasses={['name']}
        showError={shouldShowError(props.fullName)}
        errorMessage="Please enter your name."
      />
      <p className="component-your-details__info">
        <small>All fields are required.</small>
      </p>
    </form>
  );
}

// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(NameForm);
