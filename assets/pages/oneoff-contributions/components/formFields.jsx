// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import TextInput from 'components/textInput/textInput';

import {
  setFullName,
  setEmail,
} from 'helpers/user/userActions';


// ----- Types ----- //

type PropTypes = {
  nameUpdate: (name: string) => void,
  emailUpdate: (email: string) => void,
  name: string,
  email: string,
};


// ----- Component ----- //

function FormFields(props: PropTypes) {

  return (
    <form className="oneoff-contrib__name-form">
      <TextInput
        id="name"
        placeholder="Full name"
        value={props.name}
        onChange={props.nameUpdate}
        required
      />
      <TextInput
        id="email"
        placeholder="Email"
        value={props.email}
        onChange={props.emailUpdate}
        required
      />
    </form>
  );

}


// ----- Map State/Props ----- //

function mapStateToProps(state) {
  const { user } = state.page;
  return {
    name: user.fullName,
    email: user.email,
    isoCountry: state.common.country,
  };

}

function mapDispatchToProps(dispatch) {

  return {
    nameUpdate: (name: string) => {
      dispatch(setFullName(name));
    },
    emailUpdate: (email: string) => {
      dispatch(setEmail(email));
    },
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(FormFields);
