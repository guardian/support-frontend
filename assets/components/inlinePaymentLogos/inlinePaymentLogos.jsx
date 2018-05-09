// @flow

// ----- Imports ----- //

import React from 'react';

import SvgVisaLogo from 'components/svgs/visaLogo';
import SvgMastercardLogo from 'components/svgs/mastercardLogo';
import SvgPaypalLogo from 'components/svgs/payPalLogo';
import SvgAmexLogo from 'components/svgs/amexLogo';
import { classNameWithModifiers } from '../../helpers/utilities';

// ----- Component ----- //

export default function InlinePaymentLogos(props: {modifierClass: string}) {

  return (
    <div className={classNameWithModifiers('component-inline-payment-logos', [props.modifierClass])} >
      <SvgVisaLogo />
      <SvgMastercardLogo />
      <SvgAmexLogo />
      <SvgPaypalLogo />
    </div>
  );
}
