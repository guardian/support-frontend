// @flow

// ----- Imports ----- //

import React from 'react';

import { classNameWithModifiers } from 'helpers/utilities';

import SvgVisaLogo from 'components/svgs/visaLogo';
import SvgMastercardLogo from 'components/svgs/mastercardLogo';
import SvgPaypalLogo from 'components/svgs/payPalLogo';
import SvgAmexLogo from 'components/svgs/amexLogo';

import type { Contrib as ContributionType } from 'helpers/contributions';

// ----- Component ----- //

export default function ContributionAwarePaymentLogos(props: { contributionType: ContributionType }) {
  const modifierClass = props.contributionType === 'ONE_OFF' ? 'one-off' : '';

  return (
    <div
      className={classNameWithModifiers('component-contribution-aware-payment-logos', [modifierClass])}
      aria-labelledby="component-contribution-aware-payment-logos-a11y-hint"
    >
      <SvgVisaLogo />
      <SvgMastercardLogo />
      <SvgAmexLogo />
      <SvgPaypalLogo />
      <p id="component-contribution-aware-payment-logos-a11y-hint" className="accessibility-hint">
        We accept Visa, Mastercard, American Express and PayPal
      </p>
    </div>
  );
}
