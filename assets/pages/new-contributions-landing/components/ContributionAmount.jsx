// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import { amounts, type Amount, type Contrib } from 'helpers/contributions';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { type IsoCurrency, type Currency, type SpokenCurrency, currencies, spokenCurrencies } from 'helpers/internationalisation/currency';
import { classNameWithModifiers } from 'helpers/utilities';

import SvgDollar from 'components/svgs/dollar';

import { selectAmount, selectOtherAmount } from '../contributionsLandingActions';

// ----- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {
  countryGroupId: CountryGroupId,
  currency: IsoCurrency,
  contributionType: Contrib,
  amount?: Amount,
  showOther: boolean,
  selectAmount: Amount => (() => void),
  selectOtherAmount: () => void,
};
/* eslint-enable react/no-unused-prop-types */

const mapStateToProps = state => ({
  contributionType: state.page.contributionType,
  amount: state.page.amount,
  showOther: state.page.showOtherAmount,
});

const mapDispatchToProps = dispatch => ({
  selectAmount: amount => () => { dispatch(selectAmount(amount)); },
  selectOtherAmount: () => { dispatch(selectOtherAmount()); },
});

// ----- Render ----- //

const formatAmount = (currency: Currency, spokenCurrency: SpokenCurrency, amount: Amount, verbose: boolean) =>
  (verbose ?
    `${amount.value} ${amount.value === 1 ? spokenCurrency.singular : spokenCurrency.plural}` :
    `${currency.glyph}${amount.value}`);

const renderAmount = (currency: Currency, spokenCurrency: SpokenCurrency, props: PropTypes) => (amount: Amount) => (
  <li className="form__radio-group-item">
    <input
      id={`contributionAmount-${amount.value}`}
      className="form__radio-group-input"
      type="radio"
      name="contributionAmount"
      value={amount.value}
      /* eslint-disable react/prop-types */
      checked={props.amount && amount.value === props.amount.value}
      onChange={props.selectAmount(amount)}
      /* eslint-enable react/prop-types */
    />
    <label htmlFor={`contributionAmount-${amount.value}`} className="form__radio-group-label" aria-label={formatAmount(currency, spokenCurrency, amount, true)}>
      {formatAmount(currency, spokenCurrency, amount, false)}
    </label>
  </li>
);


function ContributionAmount(props: PropTypes) {
  return (
    <fieldset className={classNameWithModifiers('form__radio-group', ['pills', 'contribution-amount'])}>
      <legend className={classNameWithModifiers('form__legend', ['radio-group'])}>Amount</legend>
      <ul className="form__radio-group-list">
        {amounts('notintest')[props.contributionType][props.countryGroupId].map(renderAmount(currencies[props.currency], spokenCurrencies[props.currency], props))}
        <li className="form__radio-group-item">
          <input
            id="contributionAmount-other"
            className="form__radio-group-input"
            type="radio"
            name="contributionAmount"
            value="other"
            checked={props.showOther}
            onChange={props.selectOtherAmount}
          />
          <label htmlFor="contributionAmount-other" className="form__radio-group-label">Other</label>
        </li>
      </ul>
      {props.showOther ? (
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

ContributionAmount.defaultProps = {
  amount: null,
  otherAmount: null,
};

const NewContributionAmount = connect(mapStateToProps, mapDispatchToProps)(ContributionAmount);


export { formatAmount, NewContributionAmount };
