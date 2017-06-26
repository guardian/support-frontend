// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import TextInput from 'components/textInput/textInput';

import {
  setFirstName,
  setLastName,
} from 'helpers/user/userActions';


// ----- Types ----- //

type PropTypes = {
  firstNameUpdate: (name: string) => void,
  lastNameUpdate: (name: string) => void,
  firstName: string,
  lastName: string,
};


// ----- Component ----- //

function NameForm(props: PropTypes) {

  return (
    <form className="monthly-contrib__name-form">
      <TextInput
        id="first-name"
        placeholder="First name"
        value={props.firstName}
        onChange={props.firstNameUpdate}
        required
      />
      <TextInput
        id="last-name"
        placeholder="Last name"
        value={props.lastName}
        onChange={props.lastNameUpdate}
        required
      />
    </form>
  );

}


// ----- Map State/Props ----- //

function mapStateToProps(state) {

  return {
    firstName: state.user.firstName,
    lastName: state.user.lastName,
  };

}

function mapDispatchToProps(dispatch) {

  return {
    firstNameUpdate: (name: string) => {
      dispatch(setFirstName(name));
    },
    lastNameUpdate: (name: string) => {
      dispatch(setLastName(name));
    },
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(NameForm);
