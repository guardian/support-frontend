// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import { type ContributionType } from 'helpers/contributions';
import { type Participations } from 'helpers/abTests/abtest';
import { classNameWithModifiers } from 'helpers/utilities';
import {
  getPaymentMethodToSelect,
  getValidContributionTypes,
  toHumanReadableContributionType,
} from 'helpers/checkouts';

import { trackComponentClick } from 'helpers/tracking/ophanComponentEventTracking';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { Switches } from 'helpers/settings';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { type State } from '../contributionsLandingReducer';
import { updateContributionTypeAndPaymentMethod } from '../contributionsLandingActions';

// ----- Types ----- //

type PropTypes = {|
  contributionType: ContributionType,
  countryId: IsoCountry,
  countryGroupId: CountryGroupId,
  switches: Switches,
  onSelectContributionType: (ContributionType, Switches, IsoCountry, CountryGroupId) => void,
  abParticipations: Participations,
|};

const mapStateToProps = (state: State) => ({
  countryGroupId: state.common.internationalisation.countryGroupId,
  contributionType: state.page.form.contributionType,
  countryId: state.common.internationalisation.countryId,
  switches: state.common.settings.switches,
  abParticipations: state.common.abParticipations,
});

const mapDispatchToProps = (dispatch: Function) => ({
  onSelectContributionType: (
    contributionType: ContributionType,
    switches: Switches,
    countryId: IsoCountry,
    countryGroupId: CountryGroupId,
  ) => {
    const paymentMethodToSelect = getPaymentMethodToSelect(contributionType, switches, countryId);
    trackComponentClick(`npf-contribution-type-toggle-${countryGroupId}-${contributionType}`);
    dispatch(updateContributionTypeAndPaymentMethod(contributionType, paymentMethodToSelect));
  },
});

// ----- Render ----- //

function ContributionTypeTabs(props: PropTypes) {
  return (
    <fieldset className={classNameWithModifiers('form__radio-group', ['tabs', 'contribution-type'])}>
      <legend className={classNameWithModifiers('form__legend', ['radio-group'])}>Recurrence</legend>
      <ul className="form__radio-group-list">
        {getValidContributionTypes(props.abParticipations).map((contributionType: ContributionType) => (
          <li className="form__radio-group-item">
            <input
              id={`contributionType-${contributionType}`}
              className="form__radio-group-input"
              type="radio"
              name="contributionType"
              value={contributionType}
              onChange={() =>
                props.onSelectContributionType(contributionType, props.switches, props.countryId, props.countryGroupId)
              }
              checked={props.contributionType === contributionType}
            />
            <label htmlFor={`contributionType-${contributionType}`} className="form__radio-group-label">
              {toHumanReadableContributionType(contributionType)}
            </label>
          </li>))}
      </ul>
    </fieldset>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(ContributionTypeTabs);
