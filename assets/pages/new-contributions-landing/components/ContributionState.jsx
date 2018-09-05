// @flow

// ----- Imports ----- //

import React from 'react';

import { usStates, caStates } from 'helpers/internationalisation/country';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { classNameWithModifiers } from 'helpers/utilities';

import SvgGlobe from 'components/svgs/globe';

// ----- Types ----- //
type PropTypes = {
  countryGroupId: CountryGroupId,
};

// ----- Render ----- //

const renderState = ([stateValue, stateName]: [string, string]) => (
  <option value={stateValue}>{stateName}</option>
);

const renderStatesField = states => (
  <div className={classNameWithModifiers('form__field', ['contribution-state'])}>
    <label className="form__label" htmlFor="contributionState">State</label>
    <span className="form__input-with-icon">
      <select id="contributionState" className="form__input" placeholder="State" required>
        <option />
        {(Object.entries(states): any).map(renderState)}
      </select>
      <span className="form__icon">
        <SvgGlobe />
      </span>
    </span>
  </div>
);

function NewContributionState(props: PropTypes) {
  switch (props.countryGroupId) {
    case 'UnitedStates':
      return renderStatesField(usStates);
    case 'Canada':
      return renderStatesField(caStates);
    default:
      return null;
  }
}

export { NewContributionState };
