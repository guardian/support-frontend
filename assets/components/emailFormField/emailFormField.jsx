// @flow

// ----- Imports ----- //

import React from 'react';
import TextInput from 'components/textInput/textInput';

// ----- Types ----- //

type PropTypes = {
  emailUpdate: (email: string) => void,
  email: string,
  isSignedIn: boolean,
};


// ----- Component ----- //

const EmailFormField = (props: PropTypes) => {

  if (props.isSignedIn) {
    return null;
  }

  return (<TextInput
    id="email"
    value={props.email}
    labelText="Email"
    placeholder="Email"
    onChange={props.emailUpdate}
    modifierClasses={['email']}
    required
  />);

};

// ----- Exports ----- //

export default EmailFormField;
