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
  let modifierClass = '';
  if (props.contributionType === 'ONE_OFF') {
    modifierClass = 'one-off';
  }

  return (
    <div className={classNameWithModifiers('contribution-aware-payment-logos', [modifierClass])}>
      <SvgVisaLogo />
      <SvgMastercardLogo />
      <SvgAmexLogo />
      <SvgPaypalLogo />
    </div>
  );
}
