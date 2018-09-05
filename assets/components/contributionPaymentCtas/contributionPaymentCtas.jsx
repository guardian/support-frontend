// @flow

// ----- Imports ----- //

import React from 'react';

import type { Node } from 'react';

import CtaLink from 'components/ctaLink/ctaLink';
import ErrorMessage from 'components/errorMessage/errorMessage';
import TermsPrivacy from 'components/legal/termsPrivacy/termsPrivacy';

import {
  getSpokenType,
  getFrequency,
} from 'helpers/contributions';
import { classNameWithModifiers } from 'helpers/utilities';
import { routes } from 'helpers/routes';
import { addQueryParamsToURL } from 'helpers/url';

import { currencies, type IsoCurrency } from 'helpers/internationalisation/currency';
import { type Contrib as ContributionType } from 'helpers/contributions';
import { type Status } from 'helpers/switch';
import { type ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';


// ----- Types ----- //

type PropTypes = {
  contributionType: ContributionType,
  amount: number,
  referrerAcquisitionData: ReferrerAcquisitionData,
  countryGroupId: CountryGroupId,
  currencyId: IsoCurrency,
  isDisabled: boolean,
  PayPalButton: React$ComponentType<{
    buttonText?: string,
    onClick?: ?(void => void),
    additionalClass?: string,
    switchStatus?: Status,
  }>,
  error: ?string,
  resetError: void => void,
  isGuestCheckout: boolean
};


// ----- Heading ----- //

// Prevents a click event if it's not allowed.
function onCtaClick(isDisabled: boolean, resetError: void => void): Function {

  return (clickEvent) => {

    if (isDisabled) {
      clickEvent.preventDefault();
    }

    resetError();

  };

}


// ----- Component ----- //

export default function ContributionPaymentCtas(props: PropTypes) {

  const baseClassName = 'component-contribution-payment-ctas';

  if (props.contributionType === 'ONE_OFF') {
    return (
      <div className={classNameWithModifiers(baseClassName, props.isDisabled ? ['disabled'] : [])}>
        <props.PayPalButton
          buttonText={`Contribute ${currencies[props.currencyId].glyph}${props.amount} with PayPal`}
          onClick={props.resetError}
        />
        <OneOffCta {...props} />
        <ErrorMessage message={props.error} />
        <TermsPrivacy countryGroupId={props.countryGroupId} />
      </div>
    );

  }

  return (
    <div className={classNameWithModifiers(baseClassName, props.isDisabled ? ['disabled'] : [])}>
      <RegularCta {...props} />
    </div>
  );

}


// ----- Auxiliary Components ----- //

// Build the one-off payment button.
function OneOffCta(props: {
  contributionType: ContributionType,
  amount: number,
  currencyId: IsoCurrency,
  isDisabled: boolean,
  resetError: void => void,
}): Node {

  const clickUrl = addQueryParamsToURL(routes.oneOffContribCheckout, {
    contributionValue: props.amount.toString(),
    contribType: props.contributionType,
    currency: props.currencyId,
  });

  return (
    <CtaLink
      text={`Contribute ${currencies[props.currencyId].glyph}${props.amount} with card`}
      accessibilityHint="proceed to make your single contribution"
      url={clickUrl}
      onClick={onCtaClick(props.isDisabled, props.resetError)}
      id="qa-contribute-button"
      modifierClasses={['contribute-one-off', 'border']}
    />
  );

}

// Build the regular payment button.
function RegularCta(props: {
  contributionType: ContributionType,
  amount: number,
  currencyId: IsoCurrency,
  isDisabled: boolean,
  resetError: void => void,
  isGuestCheckout: boolean,
}): Node {
  const recurringRoute = props.isGuestCheckout ? routes.recurringContribCheckoutGuest : routes.recurringContribCheckout;
  const frequency = getFrequency(props.contributionType);
  const spokenType = getSpokenType(props.contributionType);
  const clickUrl = addQueryParamsToURL(recurringRoute, {
    contributionValue: props.amount.toString(),
    contribType: props.contributionType,
    currency: props.currencyId,
  });

  return (
    <CtaLink
      text={`Contribute ${currencies[props.currencyId].glyph}${props.amount} ${frequency}`}
      accessibilityHint={`proceed to make your ${spokenType} contribution`}
      url={clickUrl}
      onClick={onCtaClick(props.isDisabled, props.resetError)}
      id="qa-contribute-button"
      modifierClasses={['contribute-regular']}
    />
  );

}
