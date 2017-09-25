// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { User } from 'helpers/user/userReducer';
import TextInput from 'components/textInput/textInput';
import CheckboxInput from 'components/checkboxInput/checkboxInput';

import {
  setFullName,
  setEmail,
  setPostcode,
  setGnmMarketing,
} from 'helpers/user/userActions';


// ----- Types ----- //

type PropTypes = {
  nameUpdate: (name: string) => void,
  emailUpdate: (email: string) => void,
  postcodeUpdate: (postcode: string) => void,
  gnmMarketingPreferenceUpdate: (preference: boolean) => void,
  name: string,
  email: string,
  postcode: ?string,
  gnmMarketingPreference: boolean,
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
      <CheckboxInput
        id="gnm-marketing-preference"
        checked={props.gnmMarketingPreference || false}
        onChange={props.gnmMarketingPreferenceUpdate}
        labelText="Keep me up to date with offers from the Guardian"
      />
    </form>
  );

}


// ----- Map State/Props ----- //

function mapStateToProps(state) {
  const user: User = state.page.user;

  return {
    name: user.fullName,
    email: user.email,
    postcode: user.postcode,
    gnmMarketingPreference: user.gnmMarketing,
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
    postcodeUpdate: (postcode: string) => {
      dispatch(setPostcode(postcode));
    },
    gnmMarketingPreferenceUpdate: (preference: boolean) => {
      dispatch(setGnmMarketing(preference));
    },
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(FormFields);
