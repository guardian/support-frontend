// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';

import TextInput from 'components/textInput/textInput';
import { setFullName, type Action } from 'helpers/user/userActions';


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
    labelText="Full name"
    value={props.name}
    onChange={props.nameUpdate}
    modifierClasses={['name']}
    required
  />);


// ----- Map State/Props ----- //

function mapStateToProps(state) {
  const { user } = state.page;
  return {
    name: user.fullName,
    isoCountry: state.common.internationalisation.countryId,
    isSignedIn: state.page.user.isSignedIn,
  };

}

function mapDispatchToProps(dispatch: Dispatch<Action>) {

  return {
    nameUpdate: (name: string) => {
      dispatch(setFullName(name));
    },
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(NameFormField);
