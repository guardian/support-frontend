// @flow

// ----- Imports ----- //

import React from 'react';

import SvgVisaLogo from 'components/svgs/visaLogo';
import SvgMastercardLogo from 'components/svgs/mastercardLogo';
import SvgPaypalLogo from 'components/svgs/payPalLogo';
import SvgAmexLogo from 'components/svgs/amexLogo';

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
