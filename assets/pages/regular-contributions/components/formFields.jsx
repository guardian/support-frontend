// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import TextInput from 'components/textInput/textInput';
import SelectInput from 'components/selectInput/selectInput';

import {
  setFirstName,
  setLastName,
  setStateField,
} from 'helpers/user/userActions';

import { setCountry } from 'helpers/page/pageActions';

import { euroCountries } from 'helpers/internationalisation/currency';
import { usStates } from 'helpers/internationalisation/country';

import type { IsoCountry, UsState } from 'helpers/internationalisation/country';
import type { SelectOption } from 'components/selectInput/selectInput';
import type { IsoCurrency } from 'helpers/internationalisation/currency';


// ----- Types ----- //

type PropTypes = {
  firstNameUpdate: (name: string) => void,
  lastNameUpdate: (name: string) => void,
  stateUpdate: (value: UsState) => void,
  countryUpdate: (value: string) => void,
  firstName: string,
  lastName: string,
  currency: IsoCurrency,
  country: IsoCountry,
};

// ----- Map State/Props ----- //

function mapStateToProps(state) {

  return {
    firstName: state.page.user.firstName,
    lastName: state.page.user.lastName,
    currency: state.common.currency.iso,
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
    countryUpdate: (value: IsoCountry) => {
      dispatch(setCountry(value));
    },
  };

}


// ----- Functions ----- //

function stateDropdown(currency: IsoCurrency, stateUpdate: UsState => void) {

  if (currency !== 'USD') {
    return null;
  }

  const options: SelectOption[] = Object.keys(usStates).map((stateCode: UsState) =>
    ({ value: stateCode, text: usStates[stateCode] }));

  // Sets the initial state to the first in the dropdown.
  stateUpdate(options[0].value);

  return <SelectInput id="qa-state-dropdown" onChange={stateUpdate} options={options} />;
}

function euroCountryDropdown(
  currency: IsoCurrency,
  countryUpdate: string => void,
  country: IsoCountry,
) {

  if (currency !== 'EUR') {
    return null;
  }

  const options: SelectOption[] = Object.keys(euroCountries).map((countryCode: IsoCountry) =>
    ({
      value: countryCode,
      text: euroCountries[countryCode],
      selected: countryCode === country,
    }));

  return <SelectInput id="qa-country-dropdown" onChange={countryUpdate} options={options} />;
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
      {stateDropdown(props.currency, props.stateUpdate)}
      {euroCountryDropdown(props.currency, props.countryUpdate, props.country)}
    </form>
  );
}

// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(NameForm);
