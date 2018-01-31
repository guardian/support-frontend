// @flow

// ----- Imports ----- //

import React from 'react';

import PageSection from 'components/pageSection/pageSection';
import Secure from 'components/secure/secure';
import InlinePaymentLogos from 'components/inlinePaymentLogos/inlinePaymentLogos';

import type { Node } from 'react';


// ----- Types ----- //

type PropTypes = {
  children: Node,
};


// ----- Component ----- //

export default function Contribute(props: PropTypes) {

  const paymentImages = (
    <div className="component-contribute__payment-images">
      <Secure modifierClass="contribute-header" />
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
        <Secure modifierClass="contribute-body" />
        <p className="component-contribute__copy">
          Support the&nbsp;Guardian&#39;s editorial operations by making a
          monthly, or one-off contribution today
        </p>
        {props.children}
      </PageSection>
    </div>
  );

}
