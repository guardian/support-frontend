// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import { config, amounts, type Amount, type Contrib } from 'helpers/contributions';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { type IsoCurrency, type Currency, type SpokenCurrency, currencies, spokenCurrencies } from 'helpers/internationalisation/currency';
import { classNameWithModifiers } from 'helpers/utilities';
import type { AnnualContributionsTestVariant } from 'helpers/abTests/abtestDefinitions';
import { trackComponentClick } from 'helpers/tracking/ophanComponentEventTracking';

import SvgDollar from 'components/svgs/dollar';
import SvgEuro from 'components/svgs/euro';
import SvgPound from 'components/svgs/pound';

import { selectAmount, setValueAndTogglePayPal, updateOtherAmount } from '../contributionsLandingActions';
import { NewContributionTextInput } from './ContributionTextInput';

// ----- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  countryGroupId: CountryGroupId,
  currency: IsoCurrency,
  contributionType: Contrib,
  selectedAmounts: { [Contrib]: Amount | 'other' },
  selectAmount: (Amount | 'other', Contrib) => (() => void),
  otherAmount: string | null,
  checkOtherAmount: string => boolean,
  updateOtherAmount: (string, Contrib) => void,
  checkoutFormHasBeenSubmitted: boolean,
  annualTestVariant: AnnualContributionsTestVariant,
|};

/* eslint-enable react/no-unused-prop-types */

const mapStateToProps = state => ({
  countryGroupId: state.common.internationalisation.countryGroupId,
  currency: state.common.internationalisation.currencyId,
  contributionType: state.page.form.contributionType,
  selectedAmounts: state.page.form.selectedAmounts,
  otherAmount: state.page.form.formData.otherAmounts[state.page.form.contributionType].amount,
  checkoutFormHasBeenSubmitted: state.page.form.formData.checkoutFormHasBeenSubmitted,
  annualTestVariant: state.common.abParticipations.annualContributionsRoundThree,
});

const mapDispatchToProps = (dispatch: Function) => ({
  selectAmount: (amount, contributionType) => () => {
    trackComponentClick(`change-amount-new-flow-${contributionType}-${amount}`);
    dispatch(selectAmount(amount, contributionType));
  },
  updateOtherAmount: (amount, contributionType) => {
    trackComponentClick(`change-other-amount-new-flow-${contributionType}-${amount}`);
    dispatch(setValueAndTogglePayPal<string>(updateOtherAmount, amount));
  },
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

const iconForCountryGroup = (countryGroupId: CountryGroupId): React$Element<*> => {
  switch (countryGroupId) {
    case 'GBPCountries': return <SvgPound />;
    case 'EURCountries': return <SvgEuro />;
    default: return <SvgDollar />;
  }
};


function ContributionAmount(props: PropTypes) {
  const validAmounts: Amount[] = amounts(props.annualTestVariant)[props.contributionType][props.countryGroupId];
  const showOther: boolean = props.selectedAmounts[props.contributionType] === 'other';
  const { min, max } = config[props.countryGroupId][props.contributionType]; // eslint-disable-line react/prop-types
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
          label="Other amount"
          value={props.otherAmount}
          icon={iconForCountryGroup(props.countryGroupId)}
          onInput={e => props.updateOtherAmount((e.target: any).value, props.contributionType)}
          isValid={props.checkOtherAmount(props.otherAmount || '')}
          formHasBeenSubmitted={props.checkoutFormHasBeenSubmitted}
          errorMessage={`Please provide an amount between ${minAmount} and ${maxAmount}`}
          autoComplete="off"
          step={0.01}
          min={min}
          max={max}
          autoFocus
          required
        />
      ) : null}
    </fieldset>
  );
}

const NewContributionAmount = connect(mapStateToProps, mapDispatchToProps)(ContributionAmount);


export { formatAmount, NewContributionAmount };
