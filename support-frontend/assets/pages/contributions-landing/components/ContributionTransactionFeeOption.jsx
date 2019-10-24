// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import { getAmount } from 'helpers/contributions';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import {
  type IsoCurrency,
} from 'helpers/internationalisation/currency';
import { classNameWithModifiers } from 'helpers/utilities';
import { CheckboxInput } from 'components/forms/customFields/checkbox';
// import { trackComponentClick } from 'helpers/tracking/behaviour';

// ----- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  amount: number,
  currency: IsoCurrency,
  countryGroupId: CountryGroupId,
|};
/* eslint-enable react/no-unused-prop-types */

const mapStateToProps = state => ({
  amount: getAmount(
    state.page.form.selectedAmounts,
    state.page.form.formData.otherAmounts,
    state.page.form.contributionType,
  ),
  currency: state.common.internationalisation.currencyId,
  countryGroupId: state.common.internationalisation.countryGroupId,
});

// const mapDispatchToProps = (dispatch: Function) => ({});

// ----- Render ----- //
const amountFormatted = (amount: number, currencyString: string, countryGroupId: CountryGroupId) => {
  if (amount < 1 && countryGroupId === 'GBPCountries') {
    return `${(amount * 100).toFixed(0)}p`;
  }
  return `${currencyString}${(amount).toFixed(2)}`;
};

const getTransactionFeeString = (amount: number, countryGroupId: CountryGroupId): string => {
  if (amount < 20 && amount > 0) {
    // Return a 9% transaction fee (made up number)
    return amountFormatted(amount * 0.09, '$', countryGroupId);
  }
  // Return a 3% transaction fee (made up number)
  return amountFormatted(amount * 0.09, '$', countryGroupId);
};

function withProps(props: PropTypes) {
  return (
    <fieldset className={classNameWithModifiers('form__checkbox', ['contribution-transaction-fee'])}>
      <legend className="form__legend">Would you like to cover the transaction fee?</legend>
      {props.amount && props.amount > 0 &&
      <CheckboxInput text={`The transaction fee for ${props.amount} is ${getTransactionFeeString(props.amount, props.countryGroupId)}`} />
      }
    </fieldset>
  );
}

function withoutProps() {
  return (
    <fieldset className={classNameWithModifiers('form__checkbox', ['contribution-transaction-fee'])}>
      <legend className="form__legend">Would you like to cover the transaction fee?</legend>
    </fieldset>
  );
}

// export const ContributionTransactionFeeOption = connect(mapStateToProps, mapDispatchToProps)(withProps);
export const ContributionTransactionFeeOption = connect(mapStateToProps)(withProps);
export const EmptyContributionTransactionFeeOption = withoutProps;
