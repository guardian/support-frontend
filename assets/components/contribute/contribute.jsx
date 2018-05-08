// @flow

// ----- Imports ----- //

import React from 'react';

import PageSection from 'components/pageSection/pageSection';
import Secure from 'components/secure/secure';
import InlinePaymentLogos from 'components/inlinePaymentLogos/inlinePaymentLogos';
import type { Node } from 'react';
import type { Contrib as ContributionType } from 'helpers/contributions';


// ----- Types ----- //
/* eslint-disable react/no-unused-prop-types */
type PropTypes = {
  copy: string | Node,
  children: Node,
  contributionType: ContributionType,
  paymentLogosVariant: string,
};
/* eslint-enable react/no-unused-prop-types */

// ----- Component ----- //

function getModifier(props: PropTypes) {
  if (props.paymentLogosVariant !== 'notintest') {
    return `${String(props.contributionType.toLowerCase())}--one${String(props.paymentLogosVariant)}`;
  }
  return '';
}

export default function Contribute(props: PropTypes) {
  const paymentImages = (
    <div className="component-contribute__payment-images">
      <Secure modifierClass="contribute-header" />
      <InlinePaymentLogos modifierClass={getModifier(props)} />
    </div>
  );

  return (
    <div className="component-contribute">
      <PageSection
        modifierClass={getModifier(props)}
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
