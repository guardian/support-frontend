// @flow

// ----- Imports ----- //

import type { OtherAmounts, SelectedAmounts } from 'helpers/contributions';
import React from 'react';
import { connect } from 'react-redux';
import { config, type AmountsRegions, type Amount, type ContributionType, getAmount } from 'helpers/contributions';

import type { EditorialiseAmountsVariant } from 'helpers/abTests/abtestDefinitions';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import {
  type IsoCurrency,
  type Currency,
  type SpokenCurrency,
  currencies,
  spokenCurrencies,
  detect,
} from 'helpers/internationalisation/currency';
import { classNameWithModifiers } from 'helpers/utilities';
import { trackComponentClick } from 'helpers/tracking/ophanComponentEventTracking';
import { EURCountries, GBPCountries } from 'helpers/internationalisation/countryGroup';
import { formatAmount } from 'helpers/checkouts';
import SvgDollar from 'components/svgs/dollar';
import SvgEuro from 'components/svgs/euro';
import SvgPound from 'components/svgs/pound';

import { selectAmount, updateOtherAmount } from '../contributionsLandingActions';
import { NewContributionTextInput } from './ContributionTextInput';

// ----- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  countryGroupId: CountryGroupId,
  currency: IsoCurrency,
  contributionType: ContributionType,
  amounts: AmountsRegions,
  selectedAmounts: SelectedAmounts,
  selectAmount: (Amount | 'other', CountryGroupId, ContributionType) => (() => void),
  otherAmounts: OtherAmounts,
  checkOtherAmount: (string, CountryGroupId, ContributionType) => boolean,
  updateOtherAmount: (string, CountryGroupId, ContributionType) => void,
  checkoutFormHasBeenSubmitted: boolean,
  stripePaymentRequestButtonClicked: boolean,
  editorialiseAmountsVariant: EditorialiseAmountsVariant,
|};

/* eslint-enable react/no-unused-prop-types */

const mapStateToProps = state => ({
  countryGroupId: state.common.internationalisation.countryGroupId,
  currency: state.common.internationalisation.currencyId,
  contributionType: state.page.form.contributionType,
  amounts: state.common.settings.amounts,
  selectedAmounts: state.page.form.selectedAmounts,
  otherAmounts: state.page.form.formData.otherAmounts,
  checkoutFormHasBeenSubmitted: state.page.form.formData.checkoutFormHasBeenSubmitted,
  stripePaymentRequestButtonClicked: state.page.form.stripePaymentRequestButtonData.stripePaymentRequestButtonClicked,
  editorialiseAmountsVariant: state.common.abParticipations.editorialiseAmounts,
});

const mapDispatchToProps = (dispatch: Function) => ({
  selectAmount: (amount, countryGroupId, contributionType) => () => {
    trackComponentClick(`npf-contribution-amount-toggle-${countryGroupId}-${contributionType}-${amount.value || amount}`);
    dispatch(selectAmount(amount, contributionType));
  },
  updateOtherAmount: (amount, countryGroupId, contributionType) => {
    trackComponentClick(`npf-contribution-amount-toggle-${countryGroupId}-${contributionType}-${amount}`);
    dispatch(updateOtherAmount(amount));
  },
});

// ----- Render ----- //

const isSelected = (amount: Amount, props: PropTypes) => {
  if (props.selectedAmounts[props.contributionType]) {
    return props.selectedAmounts[props.contributionType] !== 'other' &&
      amount.value === props.selectedAmounts[props.contributionType].value;
  }
  return amount.isDefault;
};

const renderAmount = (currency: Currency, spokenCurrency: SpokenCurrency, props: PropTypes) => (amount: Amount) => (
  <li className="form__radio-group-item">
    <input
      id={`contributionAmount-${amount.value}`}
      className="form__radio-group-input"
      type="radio"
      name="contributionAmount"
      value={amount.value}
      /* eslint-disable react/prop-types */
      checked={isSelected(amount, props)}
      onChange={props.selectAmount(amount, props.countryGroupId, props.contributionType)}
      /* eslint-enable react/prop-types */
    />
    <label htmlFor={`contributionAmount-${amount.value}`} className="form__radio-group-label" aria-label={formatAmount(currency, spokenCurrency, amount, true)}>
      {formatAmount(currency, spokenCurrency, amount, false)}
    </label>
  </li>
);

const iconForCountryGroup = (countryGroupId: CountryGroupId): React$Element<*> => {
  switch (countryGroupId) {
    case GBPCountries: return <SvgPound />;
    case EURCountries: return <SvgEuro />;
    default: return <SvgDollar />;
  }
};

const localisedAverageAmountSentence: {
  [CountryGroupId]: {
    amountSentence: string,
    averageAnnualAmount: number,
  }
} = {
  GBPCountries: {
    amountSentence: 'In the UK, the',
    averageAnnualAmount: 50.37,
  },
  UnitedStates: {
    amountSentence: 'In the US, the',
    averageAnnualAmount: 50.16,
  },
  AUDCountries: {
    amountSentence: 'In Australia, the',
    averageAnnualAmount: 82.65,
  },
  EURCountries: {
    amountSentence: 'In Europe, the',
    averageAnnualAmount: 52.92,
  },
  NZDCountries: {
    amountSentence: 'In New Zealand, the',
    averageAnnualAmount: 58.51,
  },
  Canada: {
    amountSentence: 'In Canada, the',
    averageAnnualAmount: 62.68,
  },
  International: {
    amountSentence: 'The',
    averageAnnualAmount:  61.78,
  },
};


function averageAmountVariantCopy(
  countryGroupId: CountryGroupId,
  contributionType: ContributionType,
  currencyString: string,
) {
  const localAverageAmountInfo = localisedAverageAmountSentence[countryGroupId];
  const localAverageAmount = Math.round(localAverageAmountInfo.averageAnnualAmount);
  const localAverageAmountSentence = localAverageAmountInfo.amountSentence;
  return `Please select the amount you'd like to contribute each year. ${localAverageAmountSentence} average is ${currencyString}${localAverageAmount}.`;
}

const getEditorialisedAmountsCopy = (
  editorialiseAmountsVariant: EditorialiseAmountsVariant,
  contributionType: ContributionType,
  countryGroupId: CountryGroupId,
  selectedAmounts: SelectedAmounts,
  otherAmounts: OtherAmounts,
): string => {
  const currencyString = currencies[detect(countryGroupId)].glyph;
  const amount = getAmount(selectedAmounts, otherAmounts, contributionType);

  if (editorialiseAmountsVariant === 'control') {
    return '';
  }

  if (editorialiseAmountsVariant === 'averageAnnualAmount' && contributionType === 'ANNUAL') {
    return averageAmountVariantCopy(countryGroupId, contributionType, currencyString);
  }

  if (editorialiseAmountsVariant === 'monthlyBreakdownAnnual' && contributionType === 'ANNUAL' && amount) {
    return `Contributing ${currencyString}${amount} works out as ${currencyString}${(amount / 12.00).toFixed(2)} each month`;
  }

  if (editorialiseAmountsVariant === 'weeklyBreakdownAnnual' && contributionType === 'ANNUAL' && amount) {
    return `Contributing ${currencyString}${amount} works out as ${currencyString}${(amount / 52.00).toFixed(2)} each week`;
  }

  return '';
};

function ContributionAmount(props: PropTypes) {
  const validAmounts: Amount[] = props.amounts[props.countryGroupId][props.contributionType];
  const showOther: boolean = props.selectedAmounts[props.contributionType] === 'other';
  const { min, max } = config[props.countryGroupId][props.contributionType]; // eslint-disable-line react/prop-types
  const minAmount: string =
    formatAmount(currencies[props.currency], spokenCurrencies[props.currency], { value: min.toString() }, false);
  const maxAmount: string =
    formatAmount(currencies[props.currency], spokenCurrencies[props.currency], { value: max.toString() }, false);
  const otherAmount = props.otherAmounts[props.contributionType].amount;
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
            onChange={props.selectAmount('other', props.countryGroupId, props.contributionType)}
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
          value={otherAmount}
          icon={iconForCountryGroup(props.countryGroupId)}
          onInput={e => props.updateOtherAmount((e.target: any).value, props.countryGroupId, props.contributionType)}
          isValid={props.checkOtherAmount(otherAmount || '', props.countryGroupId, props.contributionType)}
          formHasBeenSubmitted={(props.checkoutFormHasBeenSubmitted || props.stripePaymentRequestButtonClicked)}
          errorMessage={`Please provide an amount between ${minAmount} and ${maxAmount}`}
          autoComplete="off"
          step={0.01}
          min={min}
          max={max}
          autoFocus
          required
        />
      ) : null}
      <p className="editorialise-amounts-test-copy">
        {getEditorialisedAmountsCopy(
          props.editorialiseAmountsVariant,
          props.contributionType,
          props.countryGroupId,
          props.selectedAmounts,
          props.otherAmounts,
        )}
      </p>
    </fieldset>
  );
}

const NewContributionAmount = connect(mapStateToProps, mapDispatchToProps)(ContributionAmount);


export { formatAmount, NewContributionAmount };
