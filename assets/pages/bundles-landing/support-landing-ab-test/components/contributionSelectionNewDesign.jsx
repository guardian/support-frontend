// @flow

// ----- Imports ----- //

import React from 'react';

import RadioToggle from 'components/radioToggle/radioToggle';
import NumberInput from 'components/numberInput/numberInput';
import ErrorMessage from 'components/errorMessage/errorMessage';

import { clickSubstituteKeyPressHandler } from 'helpers/utilities';
import { errorMessage as contributionsErrorMessage } from 'helpers/contributions';

import type { IsoCountry } from 'helpers/internationalisation/country';
import type { Currency } from 'helpers/internationalisation/currency';
import type {
  Amount,
  Contrib as ContributionType,
  ContribError as ContributionError,
} from 'helpers/contributions';
import { generateClassName } from 'helpers/utilities';

import {
  getClassName as getContributionTypeClassName,
  getContributionTypes,
} from '../helpers/contributionTypes';
import {
  getCustomAmountA11yHint,
  getContributionAmounts,
} from '../helpers/contributionAmounts';


// ----- Types ----- //

type PropTypes = {
  contributionType: ContributionType,
  country: IsoCountry,
  currency: Currency,
  selectedAmount: Amount,
  toggleAmount: string => void,
  toggleType: string => void,
  setCustomAmount: string => void,
  contributionError: ContributionError,
};


// ----- Functions ----- //

function getClassName(contributionType: ContributionType) {

  return generateClassName(
    'component-contribution-selection',
    getContributionTypeClassName(contributionType),
  );

}

function showError(
  error: ContributionError,
  currency: Currency,
  contributionType: ContributionType,
) {

  if (error) {

    const message = contributionsErrorMessage(error, currency, contributionType);
    return <ErrorMessage message={message} />;

  }

  return null;

}


// ----- Exports ----- //

export default function ContributionSelection(props: PropTypes) {

  return (
    <div className={getClassName(props.contributionType)}>
      <div className="component-contribution-selection__type">
        <RadioToggle
          name="contribution-type-toggle"
          radios={getContributionTypes(props.country)}
          checked={props.contributionType}
          toggleAction={props.toggleType}
        />
      </div>
      <div className="component-contribution-selection__amount">
        <RadioToggle
          name="contribution-amount-toggle"
          radios={getContributionAmounts(props.contributionType, props.currency)}
          checked={props.selectedAmount.value}
          toggleAction={props.toggleAmount}
        />
      </div>
      <div className="component-contribution-selection__custom-amount">
        <NumberInput
          onFocus={props.setCustomAmount}
          onInput={props.setCustomAmount}
          selected={props.selectedAmount.userDefined}
          placeholder="Other amount"
          onKeyPress={clickSubstituteKeyPressHandler(() => {})}
          ariaDescribedBy="component-contribution-selection__custom-amount-a11y"
          labelText={props.currency.glyph}
        />
        <p className="accessibility-hint" id="component-contribution-selection__custom-amount-a11y">
          {getCustomAmountA11yHint(props.contributionType, props.country, props.currency)}
        </p>
        {showError(props.contributionError, props.currency, props.contributionType)}
      </div>
    </div>
  );

}
