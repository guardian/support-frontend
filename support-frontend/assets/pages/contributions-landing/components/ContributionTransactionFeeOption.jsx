// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import { getAmountWithoutTransactionFee, getFormattedAmount, getTransactionFee } from 'helpers/contributions';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import {
  currencies, detect,
  type IsoCurrency,
} from 'helpers/internationalisation/currency';
import { classNameWithModifiers } from 'helpers/utilities';
import { CheckboxInput } from 'components/forms/customFields/checkbox';
import type { ContributionType, OtherAmounts, SelectedAmounts } from 'helpers/contributions';
import { updateTransactionFeeConsent } from 'pages/contributions-landing/contributionsLandingActions';
import type { LandingPageTransactionFeeCopyVariants } from 'helpers/abTests/abtestDefinitions';
// import { trackComponentClick } from 'helpers/tracking/behaviour';

// ----- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  selectedAmounts: SelectedAmounts,
  otherAmounts: OtherAmounts,
  contributionType: ContributionType,
  currency: IsoCurrency,
  countryGroupId: CountryGroupId,
  transactionFeeConsent: boolean => void,
  landingPageTransactionFeeCopyVariant: LandingPageTransactionFeeCopyVariants,
|};
/* eslint-enable react/no-unused-prop-types */

const mapStateToProps = state => ({
  selectedAmounts: state.page.form.selectedAmounts,
  otherAmounts: state.page.form.formData.otherAmounts,
  contributionType: state.page.form.contributionType,
  currency: state.common.internationalisation.currencyId,
  countryGroupId: state.common.internationalisation.countryGroupId,
  landingPageTransactionFeeCopyVariant: state.common.abParticipations.landingPageTransactionFeeCopy,
});

const mapDispatchToProps = (dispatch: Function) => ({
  transactionFeeConsent: (transactionFeeConsent: boolean) => {
    dispatch(updateTransactionFeeConsent(transactionFeeConsent));
  },
});

// ----- Render ----- //

function withProps(props: PropTypes) {
  const {
    selectedAmounts,
    otherAmounts,
    contributionType,
    countryGroupId,
    transactionFeeConsent,
    landingPageTransactionFeeCopyVariant,
  } = props;
  const baseAmount = getAmountWithoutTransactionFee(
    selectedAmounts,
    otherAmounts,
    contributionType,
  );
  const currencyString = currencies[detect(countryGroupId)].glyph;
  const transactionFee = getTransactionFee(baseAmount);
  const formattedTransactionFee = getFormattedAmount(transactionFee, currencyString, countryGroupId);

  const copyVariants = {
    pleaseAdd: `Please add ${formattedTransactionFee} to my contribution to cover the transaction fees`,
    iAmHappyToAdd: `Yes, I am happy to cover the transaction fees (+ ${formattedTransactionFee})`,
    iWillCover: `I will cover the transaction fees so more of my contribution goes directly to The Guardian (+ ${formattedTransactionFee})`,
  };

  return contributionType === 'ONE_OFF' &&
    landingPageTransactionFeeCopyVariant !== 'control' &&
    landingPageTransactionFeeCopyVariant !== 'notintest' ? (
      <fieldset className={classNameWithModifiers('form__checkbox', ['contribution-transaction-fee'])}>
        <legend className="form__legend">Would you like to cover the transaction fee?</legend>
        {baseAmount && baseAmount > 0 && transactionFee &&
        <CheckboxInput
          text={copyVariants[landingPageTransactionFeeCopyVariant]}
          onChange={event => transactionFeeConsent(event.target.checked)}
        />
      }
      </fieldset>
    ) : null;
}

function withoutProps() {
  return (
    <fieldset className={classNameWithModifiers('form__checkbox', ['contribution-transaction-fee'])}>
      <legend className="form__legend">Would you like to cover the transaction fee?</legend>
    </fieldset>
  );
}

export const ContributionTransactionFeeOption = connect(mapStateToProps, mapDispatchToProps)(withProps);
// export const ContributionTransactionFeeOption = connect(mapStateToProps)(withProps);
export const EmptyContributionTransactionFeeOption = withoutProps;
