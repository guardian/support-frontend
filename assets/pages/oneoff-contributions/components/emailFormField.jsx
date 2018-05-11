// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';

import TextInput from 'components/textInput/textInput';
import { setEmail, type Action } from 'helpers/user/userActions';


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
    placeholder="Email"
    onChange={props.emailUpdate}
    required
  />);

};


// ----- Map State/Props ----- //

function mapStateToProps(state) {
  const { user } = state.page;
  return {
    email: user.email,
    isoCountry: state.common.country,
    isSignedIn: state.page.user.isSignedIn,
  };

}

function mapDispatchToProps(dispatch: Dispatch<Action>) {

  return {
    emailUpdate: (email: string) => {
      dispatch(setEmail(email));
    },
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(EmailFormField);
