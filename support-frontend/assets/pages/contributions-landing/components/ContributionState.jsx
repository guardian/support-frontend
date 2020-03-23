// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import { usStates, caStates, type StateProvince, auStates } from 'helpers/internationalisation/country';
import { type CountryGroupId, type CountryGroup, countryGroups, AUDCountries } from 'helpers/internationalisation/countryGroup';
import { classNameWithModifiers } from 'helpers/utilities';
import { Canada, UnitedStates } from 'helpers/internationalisation/countryGroup';
import SvgGlobe from 'components/svgs/globe';

import { type State } from '../contributionsLandingReducer';

// ----- Types ----- //
type PropTypes = {|
  countryGroupId: CountryGroupId,
  selectedState: StateProvince | null,
  onChange: (Event => void) | false,
  isValid: boolean,
  formHasBeenSubmitted: boolean,
  contributionType: string,
|};

const mapStateToProps = (state: State) => ({
  countryGroupId: state.common.internationalisation.countryGroupId,
  contributionType: state.page.form.contributionType,
});

// ----- Render ----- //
const renderState = (selectedState: StateProvince | null) => (state: {abbreviation: string, name: string}) => (
  <option value={state.abbreviation} selected={selectedState === state.abbreviation}>{state.name}</option>
);

const renderStatesField = (
  states: {[string]: string},
  selectedState: StateProvince | null,
  onChange: (Event => void) | false,
  showError: boolean,
  label: string,
) => (
  <div className={classNameWithModifiers('form__field', ['contribution-state'])}>
    <label className="form__label" htmlFor="contributionState">
      {label}
    </label>
    <span className="form__input-with-icon">
      <select id="contributionState" className={classNameWithModifiers('form__input', selectedState ? [] : ['placeholder'])} onChange={onChange} required>
        <option value="">Please select your {label.toLowerCase()}</option>
        {Object.keys(states)
          .map(key => ({ abbreviation: key, name: states[key] }))
          .map(renderState(selectedState))}
      </select>
      <span className="form__icon">
        <SvgGlobe />
      </span>
    </span>
    {showError ? (
      <div className="form__error">
        Please provide a {label.toLowerCase()}
      </div>
      ) : null}
  </div>
);

function ContributionState(props: PropTypes) {
  const showError = !props.isValid && props.formHasBeenSubmitted;
  if (props.contributionType !== 'ONE_OFF') {
    switch (props.countryGroupId) {
      case UnitedStates:
        return renderStatesField(usStates, props.selectedState, props.onChange, showError, 'State');
      case Canada:
        return renderStatesField(caStates, props.selectedState, props.onChange, showError, 'Province');
      case AUDCountries: {
        // Don't show states if the user is GEO-IP'd to one of the non AU countries that use AUD.
        if (window.guardian && window.guardian.geoip) {
          const AUDCountryGroup: CountryGroup = countryGroups[AUDCountries];
          const AUDCountriesWithNoStates = AUDCountryGroup.countries.filter(c => c !== 'AU');
          if (AUDCountriesWithNoStates.includes(window.guardian.geoip.countryCode)) {
            return null;
          }
        }
        return renderStatesField(auStates, props.selectedState, props.onChange, showError, 'State / Territory');
      }
      default:
        return null;
    }
  }

  return null;
}

ContributionState.defaultProps = {
  onChange: false,
};

export default connect(mapStateToProps)(ContributionState);
