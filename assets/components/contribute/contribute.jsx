// @flow

// ----- Imports ----- //

import React from 'react';

import PageSection from 'components/pageSection/pageSection';
import Secure from 'components/secure/secure';
import InlinePaymentLogos from 'components/inlinePaymentLogos/inlinePaymentLogos';
import type { Node } from 'react';


// ----- Types ----- //

type PropTypes = {
  copy: string | Node,
  children: Node,
  contributionType: ContributionType,
  paymentLogosVariant: string,
};


// ----- Component ----- //

export default function Contribute(props: PropTypes) {
  const modifier = `${props.contributionType.toLowerCase()}-${props.paymentLogosVariant}`;
  const paymentImages = (
    <div className="component-contribute__payment-images">
      <Secure modifierClass="contribute-header" />
      <InlinePaymentLogos modifierClass={modifier} />
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
        <p className="component-contribute__description">{props.copy}</p>
        {props.children}
      </PageSection>
    </div>
  );

}
