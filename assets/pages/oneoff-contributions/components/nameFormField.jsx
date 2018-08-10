// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import ErrorMessage from 'components/errorMessage/errorMessage';
import { setFullName, type Action as UserAction } from 'helpers/user/userActions';
import TextInput from 'components/textInput/textInput';
import { type UserFormFieldAttribute, formFieldError, shouldShowError } from 'helpers/checkoutForm/checkoutForm';
import { type Action as CheckoutFormAction, setFullNameShouldValidate } from './contributionsCheckoutContainer/checkoutFormActions';


// ----- Types ----- //

type PropTypes = {
  name: UserFormFieldAttribute,
};


// ----- Component ----- //

const NameFormField = (props: PropTypes) => {
  const showError = shouldShowError(props.name);
  const modifierClass = ['name'];
  if (showError) {
    modifierClass.push('error');
  }

  return (
    <div className="component-name-form-field">
      <TextInput
        id="name"
        placeholder="Full name"
        labelText="Full name"
        value={props.name.value}
        onChange={props.name.setValue}
        onBlur={props.name.setShouldValidate}
        modifierClasses={modifierClass}
        required
      />
      <ErrorMessage
        showError={showError}
        message="Please enter your name."
      />
    </div>
  );
};


// ----- Map State/Props ----- //

function mapStateToProps(state) {
  const nameFormField = {
    value: state.page.user.fullName,
    shouldValidate: state.page.checkoutForm.fullName.shouldValidate,
  };
  return {
    stateName: nameFormField,
  };

}

function mapDispatchToProps(dispatch: Dispatch<CheckoutFormAction | UserAction>) {
  return {
    setShouldValidate: () => {
      dispatch(setFullNameShouldValidate());
    },
    setValue: (name: string) => {
      dispatch(setFullName(name));
    },

  };
}

function mergeProps(stateProps, dispatchProps) {

  const name: UserFormFieldAttribute = {
    ...stateProps.stateName,
    ...dispatchProps,
    isValid: formFieldError(stateProps.stateName.value, true),
  };

  return {
    name,
  };
}


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(NameFormField);
