// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { detect as detectCountry } from 'helpers/internationalisation/country';
import TextInput from 'components/textInput/textInput';

import {
  setFullName,
  setEmail,
  setPostcode,
  setStateField,
} from 'helpers/user/userActions';


// ----- Types ----- //

type PropTypes = {
  nameUpdate: (name: string) => void,
  emailUpdate: (email: string) => void,
  postcodeUpdate: (postcode: string) => void,
  stateFieldUpdate: (stateField: string) => void,
  name: string,
  email: string,
  postcode: ?string,
  stateField: string,
  isoCountry: IsoCountry,
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
      {props.isoCountry === 'US' ?
        <TextInput
          id="state"
          placeholder="State"
          value={props.stateField || ''}
          onChange={props.stateFieldUpdate}
          required
        /> : null
      }
      <TextInput
        id="postcode"
        placeholder={`${props.isoCountry === 'US' ? 'Zip' : 'Postcode'} (optional)`}
        value={props.postcode || ''}
        onChange={props.postcodeUpdate}
      />
    </form>
  );

}


// ----- Map State/Props ----- //

function mapStateToProps(state) {

  return {
    name: state.user.fullName,
    email: state.user.email,
    stateField: state.user.stateField,
    postcode: state.user.postcode,
    isoCountry: state.isoCountry || detectCountry(),
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
    stateFieldUpdate: (stateField: string) => {
      dispatch(setStateField(stateField));
    },
    postcodeUpdate: (postcode: string) => {
      dispatch(setPostcode(postcode));
    },
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(FormFields);
