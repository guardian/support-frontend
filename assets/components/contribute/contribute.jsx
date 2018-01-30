// @flow

// ----- Imports ----- //

import React from 'react';

import PageSection from 'components/pageSection/pageSection';
import Secure from 'components/secure/secure';
import InlinePaymentLogos from 'components/inlinePaymentLogos/inlinePaymentLogos';


// ----- Component ----- //

export default function Contribute() {

  const paymentImages = (
    <div className="component-contribute__payment-images">
      <Secure />
      <InlinePaymentLogos />
    </div>
  );

  return (
    <div className="component-contribute">
      <PageSection
        modifierClass="contribute"
        heading="Contribute"
        headingChildren={paymentImages}
      >
        <p>Dummy content</p>
      </PageSection>
    </div>
  );

}
