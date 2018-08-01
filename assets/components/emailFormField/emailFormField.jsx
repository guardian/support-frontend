// @flow

// ----- Imports ----- //

import React from 'react';
import TextInput from 'components/textInput/textInput';
import ErrorMessage from 'components/errorMessage/errorMessage';
import { validateEmailAddress } from '../../helpers/utilities';

// ----- Types ----- //

type PropTypes = {
  emailUpdate: (email: string) => void,
  email: string,
  isSignedIn: boolean,
  setEmailHasBeenBlurred: () => void,
  emailHasBeenBlurred: boolean,
};

// ----- Component ----- //

const EmailFormField = (props: PropTypes) => {

  const showEmailError = props.emailHasBeenBlurred && !validateEmailAddress(props.email);

  if (props.isSignedIn) {
    return null;
  }

  const modifierClass = ['email'];

  if (showEmailError) {
    modifierClass.push('error');
  }

  const errorMessage = () => {
    if (!showEmailError) {
      return '';
    }
    return (<ErrorMessage message="Please enter a valid email address." />);
  };


  return (
    <div>
      <TextInput
        id="email"
        value={props.email}
        labelText="Email"
        placeholder="Email"
        onChange={props.emailUpdate}
        onBlur={props.setEmailHasBeenBlurred}
        modifierClasses={modifierClass}
        required
      />
      {errorMessage()}
    </div>
  );

};

// ----- Exports ----- //

export default EmailFormField;
