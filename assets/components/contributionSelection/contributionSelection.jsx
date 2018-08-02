// @flow

// ----- Imports ----- //

import React from 'react';

import RadioToggle from 'components/radioToggle/radioToggle';
import NumberInput from 'components/numberInput/numberInput';
import ErrorMessage from 'components/errorMessage/errorMessage';

import {
  errorMessage as contributionsErrorMessage,
  getContributionTypeClassName,
  getContributionTypeRadios,
  getContributionAmountRadios,
  getCustomAmountA11yHint,
} from 'helpers/contributions';
import { classNameWithModifiers } from 'helpers/utilities';

import type { IsoCountry } from 'helpers/internationalisation/country';
import { currencies, type IsoCurrency } from 'helpers/internationalisation/currency';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type {
  Contrib as ContributionType,
  ContributionError,
} from 'helpers/contributions';


// ----- Props ----- //

type PropTypes = {|
  country: IsoCountry,
  countryGroupId: CountryGroupId,
  currencyId: IsoCurrency,
  contributionType: ContributionType,
  selectedAmount: number,
  isCustomAmount: boolean,
  setContributionType: (string, CountryGroupId) => void,
  setAmount: string => void,
  setCustomAmount: (string, CountryGroupId) => void,
  onKeyPress: Object => void,
  error: ContributionError,
  oneOffSingleOneTimeTestVariant: 'control' | 'single' | 'once' | 'oneTime' | 'notintest',
  usOneOffSingleOneTimeTestVariant: 'control' | 'single' | 'once' | 'oneOff' | 'notintest',
  annualTestVariant: 'control' | 'annual' | 'notintest',
|};


// ----- Component ----- //

function ContributionSelection(props: PropTypes) {

  const modifierClassArray = [getContributionTypeClassName(props.contributionType)];
  if (props.annualTestVariant === 'annual') modifierClassArray.push('annual');

  return (
    <div className={classNameWithModifiers('component-contribution-selection', modifierClassArray)}>
      <div className="component-contribution-selection__type">
        <RadioToggle
          name="contribution-type-toggle"
          radios={getContributionTypeRadios(
            props.countryGroupId,
            props.oneOffSingleOneTimeTestVariant,
            props.usOneOffSingleOneTimeTestVariant,
            props.annualTestVariant,
          )}
          checked={props.contributionType}
          toggleAction={props.setContributionType}
          countryGroupId={props.countryGroupId}
        />
      </div>
      <div className="component-contribution-selection__amount">
        <RadioToggle
          name="contribution-amount-toggle"
          radios={
            getContributionAmountRadios(
              props.contributionType,
              props.currencyId,
              props.countryGroupId,
            )}
          checked={props.isCustomAmount ? null : props.selectedAmount.toString()}
          toggleAction={props.setAmount}
          countryGroupId={props.countryGroupId}
        />
      </div>
      <CustomAmountInput {...props} />
    </div>
  );

}


// ----- Auxiliary Components ----- //

function Error(props: {
  error: ContributionError,
  countryGroupId: CountryGroupId,
  contributionType: ContributionType,
}) {

  let message = null;

  if (props.error) {
    message = contributionsErrorMessage(props.error, props.contributionType, props.countryGroupId);
  }

  return <ErrorMessage message={message} />;

}

function CustomAmountInput(props: {
  setCustomAmount: (string, CountryGroupId) => void,
  isCustomAmount: boolean,
  onKeyPress: Object => void,
  currencyId: IsoCurrency,
  contributionType: ContributionType,
  countryGroupId: CountryGroupId,
  error: ContributionError,
}) {

  return (
    <div className="component-contribution-selection__custom-amount">
      <NumberInput
        onFocus={props.setCustomAmount}
        onInput={props.setCustomAmount}
        selected={props.isCustomAmount}
        placeholder="Other amount"
        onKeyPress={props.onKeyPress}
        ariaDescribedBy="component-contribution-selection__custom-amount-a11y"
        labelText={currencies[props.currencyId].glyph}
        countryGroupId={props.countryGroupId}
      />
      <p className="accessibility-hint" id="component-contribution-selection__custom-amount-a11y">
        {getCustomAmountA11yHint(props.contributionType, props.countryGroupId)}
      </p>
      <Error
        error={props.error}
        contributionType={props.contributionType}
        countryGroupId={props.countryGroupId}
      />
    </div>
  );

}
// ----- Exports ----- //

export default ContributionSelection;
