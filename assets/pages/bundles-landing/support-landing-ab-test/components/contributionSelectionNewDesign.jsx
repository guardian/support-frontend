// @flow

// ----- Imports ----- //

import React from 'react';

import RadioToggle from 'components/radioToggle/radioToggle';
import NumberInput from 'components/numberInput/numberInput';
import ErrorMessage from 'components/errorMessage/errorMessage';

import { clickSubstituteKeyPressHandler } from 'helpers/utilities';
import { errorMessage as contributionsErrorMessage } from 'helpers/contributions';

import type { Currency } from 'helpers/internationalisation/currency';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type {
  Amount,
  Contrib as ContributionType,
  ContribError as ContributionError,
} from 'helpers/contributions';
import { generateClassName } from 'helpers/utilities';
import {
  getCustomAmountA11yHint,
  getContributionAmounts,
} from 'helpers/contributionAmounts';

import {
  getClassName as getContributionTypeClassName,
  getContributionTypes,
} from 'helpers/contributionTypes';


// ----- Types ----- //

type PropTypes = {
  contributionType: ContributionType,
  countryGroupId: CountryGroupId,
  currency: Currency,
  selectedAmount: Amount,
  toggleAmount: (string, CountryGroupId)=> void,
  toggleType: (string, CountryGroupId) => void,
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


// ----- Component ----- //

function ContributionSelection(props: PropTypes) {

  return (
    <div className={getClassName(props.contributionType)}>
      <div className="component-contribution-selection__type">
        <RadioToggle
          name="contribution-type-toggle"
          radios={getContributionTypes(props.countryGroupId)}
          checked={props.contributionType}
          toggleAction={props.toggleType}
          countryGroupId={props.countryGroupId}
        />
      </div>
      <div className="component-contribution-selection__amount">
        <RadioToggle
          name="contribution-amount-toggle"
          radios={getContributionAmounts(
            props.contributionType,
            props.currency,
            props.countryGroupId,
          )}
          checked={props.selectedAmount.value}
          toggleAction={props.toggleAmount}
          countryGroupId={props.countryGroupId}
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
          {getCustomAmountA11yHint(props.contributionType, props.countryGroupId)}
        </p>
        <Error
          error={props.contributionError}
          countryGroupId={props.countryGroupId}
          contributionType={props.contributionType}
        />
      </div>
    </div>
  );

}


// ----- Auxiliary Components ----- //

function Error(props: {
  error: ContributionError,
  contributionType: ContributionType,
  countryGroupId: CountryGroupId,
}) {

  let message = null;

  if (props.error) {
    message = contributionsErrorMessage(props.error, props.contributionType, props.countryGroupId);
  }

  return <ErrorMessage message={message} />;

}


// ----- Exports ----- //

export default ContributionSelection;
