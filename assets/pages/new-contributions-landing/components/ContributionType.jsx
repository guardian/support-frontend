// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import { type Dispatch } from 'redux';
import { type Contrib } from 'helpers/contributions';
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
import { type Action, updateContributionType } from '../contributionsLandingActions';
import type { Participations } from 'helpers/abTests/abtest';

// ----- Types ----- //

type PropTypes = {|
  contributionType: Contrib,
  countryId: IsoCountry,
  countryGroupId: CountryGroupId,
  switches: Switches,
  onSelectContributionType: (Contrib, Switches, IsoCountry, CountryGroupId) => void,
  abParticipations: Participations,
|};

const mapStateToProps = (state: State) => ({
  countryGroupId: state.common.internationalisation.countryGroupId,
  contributionType: state.page.form.contributionType,
  countryId: state.common.internationalisation.countryId,
  switches: state.common.settings.switches,
  abParticipations: state.common.abParticipations,
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  onSelectContributionType: (
    contributionType: Contrib,
    switches: Switches,
    countryId: IsoCountry,
    countryGroupId: CountryGroupId,
  ) => {
    const paymentMethodToSelect = getPaymentMethodToSelect(contributionType, switches, countryId);
    trackComponentClick(`npf-contribution-type-toggle-${countryGroupId}-${contributionType}`);
    dispatch(updateContributionType(contributionType, paymentMethodToSelect));
  },
});

// ----- Render ----- //

function ContributionType(props: PropTypes) {
  return (
    <fieldset className={classNameWithModifiers('form__radio-group', ['tabs', 'contribution-type'])}>
      <legend className={classNameWithModifiers('form__legend', ['radio-group'])}>Recurrence</legend>
      <ul className="form__radio-group-list">
        {getValidContributionTypes(props.abParticipations).map((contributionType: Contrib) =>
          (<li className="form__radio-group-item">
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

const NewContributionType = connect(mapStateToProps, mapDispatchToProps)(ContributionType);

export { NewContributionType };
