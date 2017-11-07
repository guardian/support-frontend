// @flow

// ----- Imports ----- //

import React from 'react';

import {
  SvgVisaLogo,
  SvgMastercardLogo,
  SvgPaypalLogo,
  SvgAmexLogo,
} from 'components/svg/svg';


// ----- Component ----- //

export default function InlinePaymentLogos() {

  return (
    <div className="component-inline-payment-logos">
      <SvgVisaLogo />
      <SvgMastercardLogo />
      <SvgAmexLogo />
      <SvgPaypalLogo />
    </div>
  );
}
