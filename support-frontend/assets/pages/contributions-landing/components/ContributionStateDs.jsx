// @flow

// ----- Imports ----- //

import React, { useState } from 'react';

import { connect } from 'react-redux';

import { usStates, caStates, type StateProvince, auStates } from 'helpers/internationalisation/country';
import { type CountryGroupId, type CountryGroup, countryGroups, AUDCountries } from 'helpers/internationalisation/countryGroup';
import { Canada, UnitedStates } from 'helpers/internationalisation/countryGroup';
import { TextInput } from '@guardian/src-text-input';
import { checkBillingStateDs } from 'helpers/formValidation';
import { stateProvinceFieldFromString } from 'helpers/internationalisation/country';


import { type State } from '../contributionsLandingReducer';


// ----- Types ----- //
type PropTypes = {|
  countryGroupId: CountryGroupId,
  value: StateProvince | null,
  onChange: (string | null) => void,
  formHasBeenSubmitted: boolean,
  contributionType: string,
|};

const mapStateToProps = (state: State) => ({
  countryGroupId: state.common.internationalisation.countryGroupId,
  contributionType: state.page.form.contributionType,
});

// ----- Render ----- //

const renderStatesField = (
  states: {[string]: string},
  value: StateProvince | null,
  onChange: SyntheticInputEvent<HTMLInputElement> => void,
  showError: boolean,
  label: string,
) => (
  <>
    <TextInput
      id="ContributionStateDs"
      label={label}
      value={value}
      autoComplete="off"
      list="states-list"
      supporting={!showError && `Please enter your ${label.toLowerCase()}`}
      onChange={onChange}
      error={showError && `Please provide a ${label.toLowerCase()}`}
      required
      cssOverrides={{
        width: 'calc(100% - 20px)',
      }}
    />
    <datalist id="states-list">
      {Object.values(states).map(state => <option value={state} />)};
    </datalist>

  </>
);


const ContributionStateDs = (props: PropTypes) => {
  const [currentInput, setCurrentInput] = useState(props.value);
  const isValid = checkBillingStateDs(currentInput, props.countryGroupId);
  const showError = !isValid && props.formHasBeenSubmitted;

  const handleChange = (event: SyntheticInputEvent<HTMLInputElement>): void => {
    const input: string = event.target.value;
    setCurrentInput(input);
    const formattedBillingState = stateProvinceFieldFromString(props.countryGroupId, input);
    props.onChange(formattedBillingState);
  };
  if (props.contributionType !== 'ONE_OFF') {
    switch (props.countryGroupId) {
      case UnitedStates:
        return renderStatesField(usStates, currentInput, handleChange, showError, 'State');
      case Canada:
        return renderStatesField(caStates, currentInput, handleChange, showError, 'Province');
      case AUDCountries: {
        // Don't show states if the user is GEO-IP'd to one of the non AU countries that use AUD.
        if (window.guardian && window.guardian.geoip) {
          const AUDCountryGroup: CountryGroup = countryGroups[AUDCountries];
          const AUDCountriesWithNoStates = AUDCountryGroup.countries.filter(c => c !== 'AU');
          if (AUDCountriesWithNoStates.includes(window.guardian.geoip.countryCode)) {
            return null;
          }
        }
        return renderStatesField(auStates, currentInput, handleChange, showError, 'State / Territory');
      }
      default:
        return null;
    }
  }

  return null;
};

export default connect(mapStateToProps)(ContributionStateDs);
