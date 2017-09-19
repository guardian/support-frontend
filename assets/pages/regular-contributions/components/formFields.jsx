// @flow

// ----- Imports ----- //

import React from 'react'
import { connect } from 'react-redux'

import TextInput from 'components/textInput/textInput'
import type { SelectOption } from 'components/selectInput/selectInput'
import SelectInput from 'components/selectInput/selectInput'

import { setFirstName, setLastName, setStateField } from 'helpers/user/userActions'
import type { IsoCountry, UsState } from 'helpers/internationalisation/country'
import { usStates } from 'helpers/internationalisation/country'

// ----- Types ----- //

type PropTypes = {
  firstNameUpdate: (name: string) => void,
  lastNameUpdate: (name: string) => void,
  stateUpdate: (value: UsState) => void,
  firstName: string,
  lastName: string,
  country: IsoCountry,
};


// ----- Functions ----- //

function stateDropdown(country: IsoCountry, stateUpdate: UsState => void) {

  if (country === 'US') {

    const options: SelectOption[] = Object.keys(usStates).map((stateCode: UsState) =>
      ({ value: stateCode, text: usStates[stateCode] }),
    );

    // Sets the initial state to the first in the dropdown.
    stateUpdate(options[0].value);

    return <SelectInput id={'qa-state-dropdown'} onChange={stateUpdate} options={options} />;

  }

  return null;

}


// ----- Component ----- //

function NameForm(props: PropTypes) {

  return (
    <form className="regular-contrib__name-form">
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
      {stateDropdown(props.country, props.stateUpdate)}
    </form>
  );

}


// ----- Map State/Props ----- //

function mapStateToProps(state) {

  return {
    firstName: state.page.user.firstName,
    lastName: state.page.user.lastName,
    country: state.common.country,
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
    stateUpdate: (value: UsState) => {
      dispatch(setStateField(value));
    },
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(NameForm);
