// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import { usStates, caStates, type UsState, type CaState } from 'helpers/internationalisation/country';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { classNameWithModifiers } from 'helpers/utilities';

import SvgGlobe from 'components/svgs/globe';

import { type State } from '../contributionsLandingReducer';

// ----- Types ----- //
type PropTypes = {
  countryGroupId: CountryGroupId,
  selectedState: CaState | UsState | null,
  onChange: (Event => void) | false,
  errorMessage: string | null,
  isValid: boolean,
  formHasBeenSubmitted: boolean,
};

const mapStateToProps = (state: State) => ({
  countryGroupId: state.common.internationalisation.countryGroupId,
});

// ----- Render ----- //

const renderState = (selectedState: CaState | UsState | null) => ([stateValue, stateName]: [string, string]) => (
  <option value={stateValue} selected={selectedState === stateValue}>{stateName}</option>
);

const renderStatesField = (
  states: { [string]: string },
  selectedState: UsState | CaState | null,
  onChange: (Event => void) | false,
  showError: boolean, errorMessage: string | null,
) => (
  <div className={classNameWithModifiers('form__field', ['contribution-state'])}>
    <label className="form__label" htmlFor="contributionState">State</label>
    <span className="form__input-with-icon">
      <select id="contributionState" className={classNameWithModifiers('form__input', selectedState ? [] : ['placeholder'])} onChange={onChange} required>
        <option value="">Please select your state</option>
        {(Object.entries(states): any).map(renderState(selectedState))}
      </select>
      <span className="form__icon">
        <SvgGlobe />
      </span>
    </span>
    {showError ? (
      <div className="form__error">
        {errorMessage}
      </div>
      ) : null}
  </div>
);

function ContributionState(props: PropTypes) {
  const showError = !props.isValid && props.formHasBeenSubmitted;
  switch (props.countryGroupId) {
    case 'UnitedStates':
      return renderStatesField(usStates, props.selectedState, props.onChange, showError, props.errorMessage);
    case 'Canada':
      return renderStatesField(caStates, props.selectedState, props.onChange, showError, props.errorMessage);
    default:
      return null;
  }
}


ContributionState.defaultProps = {
  onChange: false,
};

const NewContributionState = connect(mapStateToProps)(ContributionState);

export { NewContributionState };
