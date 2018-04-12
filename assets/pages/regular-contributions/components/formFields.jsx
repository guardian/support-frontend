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

import { usStates, countries, caStates } from 'helpers/internationalisation/country';
import { countryGroups } from 'helpers/internationalisation/countryGroup';

import type { IsoCountry, UsState, CaState } from 'helpers/internationalisation/country';
import type { SelectOption } from 'components/selectInput/selectInput';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';


// ----- Types ----- //

type PropTypes = {
  firstNameUpdate: (name: string) => void,
  lastNameUpdate: (name: string) => void,
  stateUpdate: (value: UsState | CaState) => void,
  countryUpdate: (value: string) => void,
  firstName: string,
  lastName: string,
  countryGroup: CountryGroupId,
  country: IsoCountry,
};

// ----- Map State/Props ----- //

function mapStateToProps(state) {

  return {
    firstName: state.page.user.firstName,
    lastName: state.page.user.lastName,
    countryGroup: state.common.countryGroup,
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
    stateUpdate: (value: UsState | CaState) => {
      dispatch(setStateField(value));
    },
    countryUpdate: (value: IsoCountry) => {
      dispatch(setCountry(value));
    },
  };

}


// ----- Functions ----- //

function stateDropdown(countryGroup: CountryGroupId, stateUpdate: (UsState | CaState) => void) {

  if (countryGroup !== 'UnitedStates' && countryGroup !== 'Canada') {
    return null;
  }
  const states = countryGroup === 'Canada' ? caStates : usStates;

  const options: SelectOption[] = Object.keys(states).map((stateCode: UsState | CaState) =>
    ({ value: stateCode, text: states[stateCode] }));

  // Sets the initial state to the first in the dropdown.
  stateUpdate(options[0].value);

  return <SelectInput id="qa-state-dropdown" onChange={stateUpdate} options={options} />;
}

function countriesDropdown(
  countryGroup: CountryGroupId,
  countryUpdate: string => void,
  country: IsoCountry,
) {

  const askForCountryCountryGroups = ['EURCountries', 'International', 'NZDCountries', 'GBPCountries', 'AUDCountries'];

  if (!askForCountryCountryGroups.includes(countryGroup)) {
    return null;
  }

  const options: SelectOption[] =
    countryGroups[countryGroup].countries.map((countryCode: IsoCountry) =>
      ({
        value: countryCode,
        text: countries[countryCode],
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
      {stateDropdown(props.countryGroup, props.stateUpdate)}
      {countriesDropdown(props.countryGroup, props.countryUpdate, props.country)}
    </form>
  );
}

// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(NameForm);
