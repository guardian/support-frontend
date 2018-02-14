// @flow

// ----- Imports ----- //

import React from 'react';

import type { Node } from 'react';

import CtaLink from 'components/ctaLink/ctaLink';

import {
  getSpokenType,
  getOneOffSpokenName,
} from 'helpers/contributions';
import { generateClassName } from 'helpers/utilities';
import { routes } from 'helpers/routes';
import { addQueryParamsToURL } from 'helpers/url';

import type { Currency } from 'helpers/internationalisation/currency';
import type { Contrib as ContributionType } from 'helpers/contributions';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';


// ----- Types ----- //

type PropTypes = {
  contributionType: ContributionType,
  amount: number,
  referrerAcquisitionData: ReferrerAcquisitionData,
  country: IsoCountry,
  currency: Currency,
  canClick: boolean,
};


// ----- Heading ----- //

// Prevents a click event if it's not allowed.
function allowClick(canClick) {

  return (clickEvent) => {

    if (!canClick) {
      clickEvent.preventDefault();
    }

  };

}


// ----- Component ----- //

export default function ContributionPaymentCtas(props: PropTypes) {

  const baseClassName = 'component-contribution-payment-ctas';

  if (props.contributionType === 'ONE_OFF') {

    return (
      <div className={generateClassName(baseClassName, 'one-off')}>
        <OneOffCtas {...props} />
      </div>
    );

  }

  return (
    <div className={generateClassName(baseClassName, 'regular')}>
      <RegularCtas {...props} />
    </div>
  );

}


// ----- Auxiliary Components ----- //

// Build the one-off payment buttons.
function OneOffCtas(props: {
  contributionType: ContributionType,
  country: IsoCountry,
  amount: number,
  currency: Currency,
  canClick: boolean,
}): Node {

  const spokenType = getOneOffSpokenName(props.country);
  const clickUrl = addQueryParamsToURL(routes.oneOffContribCheckout, {
    contributionValue: props.amount.toString(),
    contribType: props.contributionType,
    currency: props.currency.iso,
  });

  return (
    <CtaLink
      ctaId="contribute-one-off"
      text={`Contribute ${props.currency.glyph}${props.amount} with card`}
      accessibilityHint={`proceed to make your ${spokenType} contribution`}
      url={clickUrl}
      onClick={allowClick(props.canClick)}
    />
  );

}

// Build the regular payment buttons.
function RegularCtas(props: {
  contributionType: ContributionType,
  country: IsoCountry,
  amount: number,
  currency: Currency,
  canClick: boolean,
}): Node {

  const spokenType = getSpokenType(props.contributionType, props.country);
  const clickUrl = addQueryParamsToURL(routes.recurringContribCheckout, {
    contributionValue: props.amount.toString(),
    contribType: props.contributionType,
    currency: props.currency.iso,
  });

  return (
    <CtaLink
      ctaId="contribute-regular"
      text={`Contribute ${props.currency.glyph}${props.amount} with card or PayPal`}
      accessibilityHint={`proceed to make your ${spokenType} contribution`}
      url={clickUrl}
      onClick={allowClick(props.canClick)}
    />
  );

}
