// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import { type Dispatch } from 'redux';
import { type Contrib } from 'helpers/contributions';
import { classNameWithModifiers } from 'helpers/utilities';
import { getPaymentMethodToSelect } from 'helpers/checkouts';

import { trackComponentClick } from 'helpers/tracking/ophanComponentEventTracking';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { Switches } from 'helpers/settings';
import { type State } from '../contributionsLandingReducer';
import { type Action, updateContributionType } from '../contributionsLandingActions';

// ----- Types ----- //

type PropTypes = {|
  contributionType: Contrib,
  countryId: IsoCountry,
  switches: Switches,
  onSelectContributionType: (Contrib, Switches, IsoCountry) => void,
|};

const mapStateToProps = (state: State) => ({
  contributionType: state.page.form.contributionType,
  countryId: state.common.internationalisation.countryId,
  switches: state.common.settings.switches,
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  onSelectContributionType: (contributionType: Contrib, switches: Switches, countryId: IsoCountry) => {
    const paymentMethodToSelect = getPaymentMethodToSelect(contributionType, switches, countryId);
    trackComponentClick(`change-contribution-type-new-flow-${contributionType}`);
    dispatch(updateContributionType(contributionType, paymentMethodToSelect));
  },
});

// ----- Render ----- //

function ContributionType(props: PropTypes) {
  const oneOff = 'ONE_OFF';
  const monthly = 'MONTHLY';
  const annual = 'ANNUAL';
  return (
    <fieldset className={classNameWithModifiers('form__radio-group', ['tabs', 'contribution-type'])}>
      <legend className={classNameWithModifiers('form__legend', ['radio-group'])}>Recurrence</legend>
      <ul className="form__radio-group-list">
        <li className="form__radio-group-item">
          <input
            id="contributionType-oneoff"
            className="form__radio-group-input"
            type="radio"
            name="contributionType"
            value={oneOff}
            onChange={() => props.onSelectContributionType(oneOff, props.switches, props.countryId)}
            checked={props.contributionType === oneOff}
          />
          <label htmlFor="contributionType-oneoff" className="form__radio-group-label">Single</label>
        </li>
        <li className="form__radio-group-item">
          <input
            id="contributionType-monthly"
            className="form__radio-group-input"
            type="radio"
            name="contributionType"
            value={monthly}
            onChange={() => props.onSelectContributionType(monthly, props.switches, props.countryId)}
            checked={props.contributionType === monthly}
          />
          <label htmlFor="contributionType-monthly" className="form__radio-group-label">Monthly</label>
        </li>
        <li className="form__radio-group-item">
          <input
            id="contributionType-annual"
            className="form__radio-group-input"
            type="radio"
            name="contributionType"
            value={annual}
            onChange={() => props.onSelectContributionType(annual, props.switches, props.countryId)}
            checked={props.contributionType === annual}
          />
          <label htmlFor="contributionType-annual" className="form__radio-group-label">Annual</label>
        </li>
      </ul>
    </fieldset>
  );
}

const NewContributionType = connect(mapStateToProps, mapDispatchToProps)(ContributionType);

export { NewContributionType };
