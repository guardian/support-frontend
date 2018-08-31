// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import { amounts, type Amount, type Contrib } from 'helpers/contributions';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { type CountryMetaData, countryGroupSpecificDetails } from 'helpers/internationalisation/contributions';

import SvgDollar from 'components/svgs/dollar';

import { type State } from '../contributionsLandingReducer';

// ----- Types ----- //

type PropTypes = {
  countryGroupDetails: CountryMetaData,
  countryGroupId: CountryGroupId,
  contributionType: Contrib,
  amount: number,
  otherAmount: ?number,
};

const mapStateToProps: State => PropTypes = state => ({
  countryGroupDetails: countryGroupSpecificDetails.GBPCountries,
  countryGroupId: state.common.internationalisation.countryGroupId,
  contributionType: 'MONTHLY',
  amount: 5,
  otherAmount: (null: ?number),
});

// ----- Render ----- //

const formatAmount = (countryGroupDetails: CountryMetaData, amount: Amount, verbose: boolean) => (verbose ?
  `${amount.value} ${countryGroupDetails.currency.name}` :
  `${countryGroupDetails.currency.symbol}${amount.value}`);

const renderAmount = (countryGroupDetails: CountryMetaData) => (amount: Amount, i) => (
  <li className="form__radio-group-item">
    <input
      id={`contributionAmount-${amount.value}`}
      className="form__radio-group-input"
      type="radio"
      name="contributionAmount"
      value={amount.value}
      checked={i === 0}
    />
    <label htmlFor={`contributionAmount-${amount.value}`} className="form__radio-group-label" aria-label={formatAmount(countryGroupDetails, amount, true)}>
      {formatAmount(countryGroupDetails, amount, false)}
    </label>
  </li>
);


function ContributionAmount(props: PropTypes) {
  return (
    <fieldset className="form__radio-group form__radio-group--pills form__radio-group--contribution-amount">
      <legend className="form__legend form__legend--radio-group">Amount</legend>
      <ul className="form__radio-group-list">
        {amounts('notintest')[props.contributionType][props.countryGroupId].map(renderAmount(props.countryGroupDetails))}
        <li className="form__radio-group-item">
          <input
            id="contributionAmount-other"
            className="form__radio-group-input"
            type="radio"
            name="contributionAmount"
            value="other"
            checked={props.amount === 'other'}
          />
          <label htmlFor="contributionAmount-other" className="form__radio-group-label">Other</label>
        </li>
      </ul>
      {props.amount === 'other' ? (
        <div className="form__field form__field--contribution-other-amount">
          <label className="form__label" htmlFor="contributionOther">Other Amount</label>
          <span className="form__input-with-icon">
            <input
              id="contributionOther"
              className="form__input"
              type="number"
              min="1"
              max="2000"
              autoComplete="off"
              value={props.otherAmount}
            />
            <span className="form__icon">
              <SvgDollar />
            </span>
          </span>
        </div>
      ) : null}
    </fieldset>
  );
}

const NewContributionAmount = connect(mapStateToProps)(ContributionAmount);


export { formatAmount, NewContributionAmount };
