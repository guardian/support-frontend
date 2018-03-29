// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import TextInput from 'components/textInput/textInput';

import { setFullName } from 'helpers/user/userActions';


// ----- Types ----- //

type PropTypes = {
  nameUpdate: (name: string) => void,
  name: string,
};


// ----- Component ----- //

const NameFormField = (props: PropTypes) =>
  (<TextInput
    id="name"
    placeholder="Full name"
    value={props.name}
    onChange={props.nameUpdate}
    required
  />);


// ----- Map State/Props ----- //

function mapStateToProps(state) {
  const { user } = state.page;
  return {
    name: user.fullName,
    isoCountry: state.common.country,
    isSignedIn: state.page.user.isSignedIn,
  };

}

function mapDispatchToProps(dispatch) {

  return {
    nameUpdate: (name: string) => {
      dispatch(setFullName(name));
    },
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(NameFormField);
