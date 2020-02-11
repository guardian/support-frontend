// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import { usStates, caStates, type UsState, type CaState } from 'helpers/internationalisation/country';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { classNameWithModifiers } from 'helpers/utilities';
import { Canada, UnitedStates } from 'helpers/internationalisation/countryGroup';
import SvgGlobe from 'components/svgs/globe';

import { type State } from '../contributionsLandingReducer';

// ----- Types ----- //
type PropTypes = {|
  countryGroupId: CountryGroupId,
  selectedState: CaState | UsState | null,
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
const renderState = (selectedState: CaState | UsState | null) => (state: {abbreviation: string, name: string}) => (
  <option value={state.abbreviation} selected={selectedState === state.abbreviation}>{state.name}</option>
);

const renderStatesField = (
  states: {[string]: string},
  selectedState: UsState | CaState | null,
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
