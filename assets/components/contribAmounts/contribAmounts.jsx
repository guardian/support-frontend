// @flow

// ----- Imports ----- //

import React from 'react';

import RadioToggle from 'components/radioToggle/radioToggle';
import NumberInput from 'components/numberInput/numberInput';
import {
  generateClassName,
  clickSubstituteKeyPressHandler,
} from 'helpers/utilities';
import { errorMessage as contributionErrorMessage } from 'helpers/contributions';

import type { Radio } from 'components/radioToggle/radioToggle';
import type { Contrib, ContribError, Amounts } from 'helpers/contributions';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { Currency } from 'helpers/internationalisation/currency';

import type { Participations } from 'helpers/abTests/abtest';


// ----- Types ----- //

// Disabling the linter here because it's just buggy...
/* eslint-disable react/no-unused-prop-types */

type PropTypes = {
  contribAmount: Amounts,
  contribType: Contrib,
  contribError: ?ContribError,
  changeContribAnnualAmount: (string, CountryGroupId) => void,
  changeContribMonthlyAmount: (string, CountryGroupId) => void,
  changeContribOneOffAmount: (string, CountryGroupId) => void,
  changeContribAmount: (string, CountryGroupId) => void,
  toggleContribType: (string, CountryGroupId) => void,
  onNumberInputKeyPress: () => void,
  countryGroupId: CountryGroupId,
  isoCountry: IsoCountry,
  currency: Currency,
  abTests: Participations,
};

/* eslint-enable react/no-unused-prop-types */

type AmountToggle = {
  [Contrib]: {
    name: string,
    radios: Radio[],
  },
};

type Toggle = {
  name: string,
  radios: Radio[],
};

type ContribAttrs = {
  toggleAction: (string, CountryGroupId) => void,
  checked: ?string,
  toggles: Toggle,
  selected: boolean,
  contribType: Contrib,
  accessibilityHint: string,
};

// ----- Setup ----- //

const amountRadiosAnnual: {
  [CountryGroupId]: Radio[]
} = {
  GBPCountries: [
    {
      value: '50',
      text: '£50',
      accessibilityHint: 'contribute fifty pounds annually',
    },
    {
      value: '75',
      text: '£75',
      accessibilityHint: 'contribute seventy five pounds annually',
    },
    {
      value: '100',
      text: '£100',
      accessibilityHint: 'contribute one hundred pounds annually',
    },
  ],
  UnitedStates: [
    {
      value: '50',
      text: '$50',
      accessibilityHint: 'contribute fifty dollars annually',
    },
    {
      value: '75',
      text: '$75',
      accessibilityHint: 'contribute seventy five dollars annually',
    },
    {
      value: '100',
      text: '$100',
      accessibilityHint: 'contribute one hundred dollars annually',
    },
  ],
  AUDCountries: [
    {
      value: '50',
      text: '$50',
      accessibilityHint: 'contribute fifty dollars annually',
    },
    {
      value: '100',
      text: '$100',
      accessibilityHint: 'contribute one hundred dollars annually',
    },
    {
      value: '250',
      text: '$250',
      accessibilityHint: 'contribute two hundred and fifty dollars annually',
    },
  ],
  EURCountries: [
    {
      value: '50',
      text: '€50',
      accessibilityHint: 'contribute fifty euros annually',
    },
    {
      value: '100',
      text: '€100',
      accessibilityHint: 'contribute one hundred euros annually',
    },
    {
      value: '250',
      text: '€250',
      accessibilityHint: 'contribute two hundred and fifty euros annually',
    },
  ],
  International: [],
};

const amountRadiosMonthly: {
  [CountryGroupId]: Radio[]
} = {
  GBPCountries: [
    {
      value: '2',
      text: '£2',
      accessibilityHint: 'contribute two pounds per month',
    },
    {
      value: '5',
      text: '£5',
      accessibilityHint: 'contribute five pounds per month',
    },
    {
      value: '10',
      text: '£10',
      accessibilityHint: 'contribute ten pounds per month',
    },
  ],
  UnitedStates: [
    {
      value: '7',
      text: '$7',
      accessibilityHint: 'contribute seven dollars per month',
    },
    {
      value: '15',
      text: '$15',
      accessibilityHint: 'contribute fifteen dollars per month',
    },
    {
      value: '30',
      text: '$30',
      accessibilityHint: 'contribute thirty dollars per month',
    },
  ],
  AUDCountries: [
    {
      value: '10',
      text: '$10',
      accessibilityHint: 'contribute ten dollars per month',
    },
    {
      value: '20',
      text: '$20',
      accessibilityHint: 'contribute twenty dollars per month',
    },
    {
      value: '40',
      text: '$40',
      accessibilityHint: 'contribute forty dollars per month',
    },
  ],
  EURCountries: [
    {
      value: '6',
      text: '€6',
      accessibilityHint: 'contribute six euros per month',
    },
    {
      value: '10',
      text: '€10',
      accessibilityHint: 'contribute ten euros per month',
    },
    {
      value: '20',
      text: '€20',
      accessibilityHint: 'contribute twenty euros per month',
    },
  ],
  International: [],
};

const amountRadiosOneOff: {
  [CountryGroupId]: Radio[]
} = {
  GBPCountries: [
    {
      value: '25',
      text: '£25',
      accessibilityHint: 'make a one-off contribution of twenty five pounds',
    },
    {
      value: '50',
      text: '£50',
      accessibilityHint: 'make a one-off contribution of fifty pounds',
    },
    {
      value: '100',
      text: '£100',
      accessibilityHint: 'make a one-off contribution of one hundred pounds',
    },
    {
      value: '250',
      text: '£250',
      accessibilityHint: 'make a one-off contribution of two hundred and fifty pounds',
    },
  ],
  UnitedStates: [
    {
      value: '25',
      text: '$25',
      accessibilityHint: 'make a one-time contribution of twenty five dollars',
    },
    {
      value: '50',
      text: '$50',
      accessibilityHint: 'make a one-time contribution of fifty dollars',
    },
    {
      value: '100',
      text: '$100',
      accessibilityHint: 'make a one-time contribution of one hundred dollars',
    },
    {
      value: '250',
      text: '$250',
      accessibilityHint: 'make a one-time contribution of two hundred and fifty dollars',
    },
  ],
  AUDCountries: [
    {
      value: '50',
      text: '$50',
      accessibilityHint: 'make a one-off contribution of fifty dollars',
    },
    {
      value: '100',
      text: '$100',
      accessibilityHint: 'make a one-off contribution of one hundred dollars',
    },
    {
      value: '250',
      text: '$250',
      accessibilityHint: 'make a one-off contribution of two hundred and fifty dollars',
    },
    {
      value: '500',
      text: '$500',
      accessibilityHint: 'make a one-off contribution of five hundred dollars',
    },
  ],
  EURCountries: [
    {
      value: '25',
      text: '€25',
      accessibilityHint: 'make a one-off contribution of twenty five euros',
    },
    {
      value: '50',
      text: '€50',
      accessibilityHint: 'make a one-off contribution of fifty euros',
    },
    {
      value: '100',
      text: '€100',
      accessibilityHint: 'make a one-off contribution of one hundred euros',
    },
    {
      value: '250',
      text: '€250',
      accessibilityHint: 'make a one-off contribution of two hundred and fifty euros',
    },
  ],
  International: [],
};

const contribCaptionRadios = {
  GB_WITH_ANNUAL: [
    {
      value: 'ANNUAL',
      text: 'Annual',
      accessibilityHint: 'Make a regular annual contribution',
    },
    {
      value: 'MONTHLY',
      text: 'Monthly',
      accessibilityHint: 'Make a regular monthly contribution',
    },
    {
      value: 'ONE_OFF',
      text: 'One-off',
      accessibilityHint: 'Make a one-off contribution',
    },
  ],
  GBPCountries: [
    {
      value: 'MONTHLY',
      text: 'Monthly',
      accessibilityHint: 'Make a regular monthly contribution',
    },
    {
      value: 'ONE_OFF',
      text: 'One-off',
      accessibilityHint: 'Make a one-off contribution',
    },
  ],
  UnitedStates: [
    {
      value: 'MONTHLY',
      text: 'Monthly',
      accessibilityHint: 'Make a regular monthly contribution',
    },
    {
      id: 'qa-one-off-toggle',
      value: 'ONE_OFF',
      text: 'One-time',
      accessibilityHint: 'Make a one-time contribution',
    },
  ],
  AUDCountries: [
    {
      value: 'MONTHLY',
      text: 'Monthly',
      accessibilityHint: 'Make a regular monthly contribution',
    },
    {
      value: 'ONE_OFF',
      text: 'One-off',
      accessibilityHint: 'Make a one-off contribution',
    },
  ],
  EURCountries: [
    {
      value: 'MONTHLY',
      text: 'Monthly',
      accessibilityHint: 'Make a regular monthly contribution',
    },
    {
      value: 'ONE_OFF',
      text: 'One-off',
      accessibilityHint: 'Make a one-off contribution',
    },
  ],
  International: [],
};

// ----- Functions ----- //

function amountToggles(countryGroupId: CountryGroupId = 'GBPCountries'): AmountToggle {
  return {
    ANNUAL: {
      name: 'contributions-amount-annual-toggle',
      radios: amountRadiosAnnual[countryGroupId],
    },
    MONTHLY: {
      name: 'contributions-amount-monthly-toggle',
      radios: amountRadiosMonthly[countryGroupId],
    },
    ONE_OFF: {
      name: 'contributions-amount-oneoff-toggle',
      radios: amountRadiosOneOff[countryGroupId],
    },
  };
}

function contribToggle(countryGroupId: CountryGroupId = 'GBPCountries', showAnnual: boolean, accessibilityHint: ?string): Toggle {
  return {
    name: 'contributions-period-toggle',
    radios: showAnnual ? contribCaptionRadios.GB_WITH_ANNUAL : contribCaptionRadios[countryGroupId],
    accessibilityHint,
  };
}

function errorMessage(
  error: ?ContribError,
  contribType: Contrib,
  countryGroupId: CountryGroupId,
): ?React$Element<any> {

  if (error) {

    const message = contributionErrorMessage(error, contribType, countryGroupId);
    return <p className="component-contrib-amounts__error-message">{message}</p>;

  }

  return null;

}

function getAttrs(props: PropTypes): ContribAttrs {

  if (props.contribType === 'ANNUAL') {

    const { userDefined } = props.contribAmount.annual;
    return {
      toggleAction: props.changeContribAnnualAmount,
      checked: !userDefined ? props.contribAmount.annual.value : null,
      toggles: amountToggles(props.countryGroupId).ANNUAL,
      selected: userDefined,
      contribType: props.contribType,
      accessibilityHint: 'Annual contribution',
    };
  } else if (props.contribType === 'MONTHLY') {

    const { userDefined } = props.contribAmount.monthly;
    return {
      toggleAction: props.changeContribMonthlyAmount,
      checked: !userDefined ? props.contribAmount.monthly.value : null,
      toggles: amountToggles(props.countryGroupId).MONTHLY,
      selected: userDefined,
      contribType: props.contribType,
      accessibilityHint: 'Monthly contribution',
    };

  }

  const { userDefined } = props.contribAmount.oneOff;
  return {
    toggleAction: props.changeContribOneOffAmount,
    checked: !userDefined ? props.contribAmount.oneOff.value : null,
    toggles: amountToggles(props.countryGroupId).ONE_OFF,
    selected: userDefined,
    contribType: props.contribType,
    accessibilityHint: `${props.isoCountry === 'US' ? 'one time' : 'one-off'} contribution`,
  };

}

function getClassName(contribType: Contrib): string {
  switch (contribType) {
    case 'ANNUAL':
    case 'MONTHLY':
      return generateClassName('component-contrib-amounts__amounts', 'recurring');
    default:
      return generateClassName('component-contrib-amounts__amounts', 'one-off');
  }
}


// ----- Component ----- //

function getShowAnnual(props): boolean {
  return props.isoCountry === 'GB' &&
    props.abTests !== undefined &&
    props.abTests.addAnnualContributions !== undefined &&
    props.abTests.addAnnualContributions === 'variant';
}

export default function ContribAmounts(props: PropTypes) {

  const showAnnual: boolean = getShowAnnual(props);
  const attrs = getAttrs(props);
  const className = getClassName(attrs.contribType);
  const contribTypeTermHint = props.isoCountry === 'US' ? 'one-time' : 'one-off';
  const contribTypeDescription = props.contribType === 'MONTHLY' ? 'monthly' : contribTypeTermHint;
  const contribMinMonthlyAmountHint = props.isoCountry === 'US' ? 'five dollars or more' : 'five pounds or more';
  const contribGroupAccessibilityHint = `Choose either to make a ${contribTypeTermHint} contribution or set up a regular contribution`;
  const contribAmountHint = `Enter an amount of ${props.contribType === 'MONTHLY' ? contribMinMonthlyAmountHint : 'your choice'}`;
  const contribOtherAmountAccessibilityHintId = `accessibility-hint-other-amount-${props.contribType.toLowerCase()}`;
  const contribOtherAmountAccessibilityHint = `${contribAmountHint} for your ${contribTypeDescription} contribution.`;
  const radioModifier = showAnnual ? 'with-annual' : 'without-annual';

  return (
    <div className="component-contrib-amounts">
      <div className="contrib-type">
        <RadioToggle
          {...contribToggle(props.countryGroupId, showAnnual, contribGroupAccessibilityHint)}
          toggleAction={props.toggleContribType}
          checked={props.contribType}
          modifierClass={radioModifier}
          countryGroupId={props.countryGroupId}
        />
      </div>
      <div className={className}>
        <RadioToggle
          {...attrs.toggles}
          toggleAction={attrs.toggleAction}
          checked={attrs.checked}
          modifierClass={radioModifier}
          countryGroupId={props.countryGroupId}
        />
        <div className="component-contrib-amounts__other-amount">
          <NumberInput
            onFocus={props.changeContribAmount}
            onInput={props.changeContribAmount}
            selected={attrs.selected}
            placeholder="Other amount"
            onKeyPress={clickSubstituteKeyPressHandler(props.onNumberInputKeyPress)}
            ariaDescribedBy={contribOtherAmountAccessibilityHintId}
            labelText={props.currency.glyph}
            countryGroupId={props.countryGroupId}
          />
          <p className="accessibility-hint" id={contribOtherAmountAccessibilityHintId}>
            {contribOtherAmountAccessibilityHint}
          </p>
        </div>
        {errorMessage(props.contribError, attrs.contribType, props.countryGroupId)}
      </div>
    </div>
  );

}
