// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';

import { config, amounts, type Amount, type Contrib } from 'helpers/contributions';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { type IsoCurrency, type Currency, type SpokenCurrency, currencies, spokenCurrencies } from 'helpers/internationalisation/currency';
import { classNameWithModifiers } from 'helpers/utilities';

import SvgDollar from 'components/svgs/dollar';

import { NewContributionTextInput } from './ContributionTextInput';

// ----- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {
  countryGroupId: CountryGroupId,
  currency: IsoCurrency,
  contributionType: Contrib,
  selectedAmounts: { [Contrib]: Amount | 'other' },
  selectAmount: (Amount | 'other', Contrib) => (() => void),
  otherAmount: string | null,
  updateOtherAmount: string => void,
};
/* eslint-enable react/no-unused-prop-types */

const mapStateToProps = state => ({
  countryGroupId: state.common.internationalisation.countryGroupId,
  currency: state.common.internationalisation.currencyId,
  contributionType: state.page.form.contributionType,
  selectedAmounts: state.page.form.selectedAmounts,
  otherAmount: state.page.form.formData.otherAmount,
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  selectAmount: (amount, contributionType) => () => { dispatch(selectAmount(amount, contributionType)); },
  updateOtherAmount: (amount) => { dispatch(updateOtherAmount(amount)); },
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
      checked={props.selectedAmounts[props.contributionType] !== 'other' && amount.value === props.selectedAmounts[props.contributionType].value}
      onChange={props.selectAmount(amount, props.contributionType)}
      /* eslint-enable react/prop-types */
    />
    <label htmlFor={`contributionAmount-${amount.value}`} className="form__radio-group-label" aria-label={formatAmount(currency, spokenCurrency, amount, true)}>
      {formatAmount(currency, spokenCurrency, amount, false)}
    </label>
  </li>
);


function ContributionAmount(props: PropTypes) {
  const validAmounts: Amount[] = amounts('notintest')[props.contributionType][props.countryGroupId];
  const showOther: boolean = props.selectedAmounts[props.contributionType] === 'other';
  const { min, max } = config[props.countryGroupId][props.contributionType];
  const minAmount: string = formatAmount(currencies[props.currency], spokenCurrencies[props.currency], { value: min.toString(), spoken: '', isDefault: false }, false);
  const maxAmount: string = formatAmount(currencies[props.currency], spokenCurrencies[props.currency], { value: max.toString(), spoken: '', isDefault: false }, false);

  return (
    <fieldset className={classNameWithModifiers('form__radio-group', ['pills', 'contribution-amount'])}>
      <legend className={classNameWithModifiers('form__legend', ['radio-group'])}>Amount</legend>
      <ul className="form__radio-group-list">
        {validAmounts.map(renderAmount(currencies[props.currency], spokenCurrencies[props.currency], props))}
        <li className="form__radio-group-item">
          <input
            id="contributionAmount-other"
            className="form__radio-group-input"
            type="radio"
            name="contributionAmount"
            value="other"
            checked={showOther}
            onChange={props.selectAmount('other', props.contributionType)}
          />
          <label htmlFor="contributionAmount-other" className="form__radio-group-label">Other</label>
        </li>
      </ul>
      {showOther ? (
        <NewContributionTextInput
              id="contributionOther"
          name="contribution-other-amount"
              type="number"
          label="Other Amount"
              value={props.otherAmount}
          icon={<SvgDollar />}
          onInput={e => props.updateOtherAmount((e.target: any).value)}
          isValid={true}
          wasBlurred={false}
          errorMessage={`Please provide an amount between ${minAmount} and ${maxAmount}`}
              autoComplete="off"
          min={min}
          max={max}
          autoFocus
              required
            />
      ) : null}
    </fieldset>
  );
}

ContributionAmount.defaultProps = {
  amount: null,
  showOther: false,
};

const NewContributionAmount = connect(mapStateToProps, mapDispatchToProps)(ContributionAmount);


export { formatAmount, NewContributionAmount };
