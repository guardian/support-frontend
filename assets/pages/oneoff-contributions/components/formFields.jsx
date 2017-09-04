// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import type { IsoCountry } from 'helpers/internationalisation/country';
import TextInput from 'components/textInput/textInput';

import {
  setFullName,
  setEmail,
  setPostcode,
} from 'helpers/user/userActions';


// ----- Types ----- //

type PropTypes = {
  nameUpdate: (name: string) => void,
  emailUpdate: (email: string) => void,
  postcodeUpdate: (postcode: string) => void,
  name: string,
  email: string,
  postcode: ?string,
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
    postcode: state.user.postcode,
    isoCountry: state.oneoffContrib.country,
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
    postcodeUpdate: (postcode: string) => {
      dispatch(setPostcode(postcode));
    },
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(FormFields);
