// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import { amounts, type Amount, type Contrib } from 'helpers/contributions';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { type IsoCurrency, type Currency, type SpokenCurrency, currencies, spokenCurrencies, detect } from 'helpers/internationalisation/currency';
import { classNameWithModifiers } from 'helpers/utilities';

import SvgDollar from 'components/svgs/dollar';

import { type State } from '../contributionsLandingReducer';

// ----- Types ----- //

type PropTypes = {
  countryGroupId: CountryGroupId,
  contributionType: Contrib,
  amount: number,
  otherAmount: ?number,
};

const mapStateToProps: State => PropTypes = state => ({
  countryGroupId: state.common.internationalisation.countryGroupId,
  contributionType: 'MONTHLY',
  amount: 5,
  otherAmount: (null: ?number),
});

// ----- Render ----- //

const formatAmount = (currency: Currency, spokenCurrency: SpokenCurrency, amount: Amount, verbose: boolean) =>
  (verbose ?
    `${amount.value} ${amount.value === 1 ? spokenCurrency.singular : spokenCurrency.plural}` :
    `${currency.glyph}${amount.value}`);

const renderAmount = (currency: Currency, spokenCurrency: SpokenCurrency) => (amount: Amount, i) => (
  <li className="form__radio-group-item">
    <input
      id={`contributionAmount-${amount.value}`}
      className="form__radio-group-input"
      type="radio"
      name="contributionAmount"
      value={amount.value}
      checked={i === 0}
    />
    <label htmlFor={`contributionAmount-${amount.value}`} className="form__radio-group-label" aria-label={formatAmount(currency, spokenCurrency, amount, true)}>
      {formatAmount(currency, spokenCurrency, amount, false)}
    </label>
  </li>
);


function ContributionAmount(props: PropTypes) {
  const currency: IsoCurrency = detect(props.countryGroupId);
  return (
    <fieldset className={classNameWithModifiers('form__radio-group', ['pills', 'contribution-amount'])}>
      <legend className={classNameWithModifiers('form__legend', ['radio-group'])}>Amount</legend>
      <ul className="form__radio-group-list">
        {amounts('notintest')[props.contributionType][props.countryGroupId].map(renderAmount(currencies[currency], spokenCurrencies[currency]))}
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
        <div className={classNameWithModifiers('form__field', ['contribution-other-amount'])}>
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
