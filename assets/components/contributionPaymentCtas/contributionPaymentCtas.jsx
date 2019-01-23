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
import { sendClickedEvent } from 'helpers/tracking/clickTracking';

import { currencies, type IsoCurrency } from 'helpers/internationalisation/currency';
import { type ContributionType } from 'helpers/contributions';
import { type Status } from 'helpers/settings';
import { type ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';


// ----- Types ----- //

type PropTypes = {|
  contributionType: ContributionType,
  amount: number,
  referrerAcquisitionData: ReferrerAcquisitionData,
  countryGroupId: CountryGroupId,
  currencyId: IsoCurrency,
  isDisabled: boolean,
  PayPalButton: React$ComponentType<{|
    buttonText?: string,
    onClick?: ?(void => void),
    additionalClass?: string,
    switchStatus?: Status,
  |}>,
  error: ?string,
  resetError: void => void,
  context: string,
|};


// ----- Heading ----- //

// Prevents a click event if it's not allowed.
function onCtaClick(isDisabled: boolean, resetError: void => void, context: string): Function {

  return (clickEvent) => {

    if (isDisabled) {
      clickEvent.preventDefault();
    } else {
      sendClickedEvent(context)();
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
        <TermsPrivacy countryGroupId={props.countryGroupId} contributionType={props.contributionType} />
      </div>
    );

  }

  return (
    <div className={classNameWithModifiers(baseClassName, props.isDisabled ? ['disabled'] : [])}>
      <RegularCta {...props} />
    </div>
  );

}

ContributionPaymentCtas.defaultProps = {
  context: 'component-contribution-payment-ctas',
};


// ----- Auxiliary Components ----- //

// Build the one-off payment button.
function OneOffCta(props: {
  contributionType: ContributionType,
  amount: number,
  currencyId: IsoCurrency,
  isDisabled: boolean,
  resetError: void => void,
  context: string,
}): Node {

  const clickUrl = addQueryParamsToURL(routes.oneOffContribCheckout, {
    contributionValue: props.amount.toString(),
    selectedContributionType: props.contributionType,
    currency: props.currencyId,
  });

  const ctaContext = props.context.concat('-one_off_cta');

  return (
    <CtaLink
      text={`Contribute ${currencies[props.currencyId].glyph}${props.amount} with card`}
      accessibilityHint="proceed to make your single contribution"
      url={clickUrl}
      onClick={onCtaClick(props.isDisabled, props.resetError, ctaContext)}
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
  context: string,
}): Node {
  const frequency = getFrequency(props.contributionType);
  const spokenType = getSpokenType(props.contributionType);
  const clickUrl = addQueryParamsToURL(routes.recurringContribCheckoutGuest, {
    contributionValue: props.amount.toString(),
    selectedContributionType: props.contributionType,
    currency: props.currencyId,
  });

  const ctaContext = props.context.concat('-regular_cta');

  return (
    <CtaLink
      text={`Contribute ${currencies[props.currencyId].glyph}${props.amount} ${frequency}`}
      accessibilityHint={`proceed to make your ${spokenType} contribution`}
      url={clickUrl}
      onClick={onCtaClick(props.isDisabled, props.resetError, ctaContext)}
      id="qa-contribute-button"
      modifierClasses={['contribute-regular']}
    />
  );

}
