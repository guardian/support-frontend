// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import TextInput from 'components/textInput/textInput';

import {
  setFirstName,
  setLastName,
} from '../actions/monthlyContributionsActions';


// ----- Types ----- //

type PropTypes = {
  firstNameUpdate: (name: string) => void,
  lastNameUpdate: (name: string) => void,
};


// ----- Component ----- //

function NameForm(props: PropTypes) {

  return (
    <form className="monthly-contrib__name-form">
      <TextInput
        id="first-name"
        placeholder="First name"
        onChange={props.firstNameUpdate}
      />
      <TextInput
        id="last-name"
        placeholder="Last name"
        onChange={props.lastNameUpdate}
      />
    </form>
  );

}


// ----- Map State/Props ----- //

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

export default connect(null, mapDispatchToProps)(NameForm);
