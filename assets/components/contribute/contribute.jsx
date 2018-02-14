// @flow

// ----- Imports ----- //

import React from 'react';

import PageSection from 'components/pageSection/pageSection';
import Secure from 'components/secure/secure';
import InlinePaymentLogos from 'components/inlinePaymentLogos/inlinePaymentLogos';
import { SvgCross } from 'components/svg/svg';

import type { Node } from 'react';


// ----- Types ----- //

type PropTypes = {
  children: Node,
  error?: ?string,
  closeError: void => void,
};


// ----- Component ----- //

function Contribute(props: PropTypes) {

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
        <p className="component-contribute__description">
          Support the&nbsp;Guardian&#39;s editorial operations by making a
          monthly, or one-off contribution today
        </p>
        {props.children}
      </PageSection>
      <ContributionError error={props.error} closeError={props.closeError} />
    </div>
  );

}


// ----- Auxiliary Components ----- //

// An overlay error message.
function ContributionError(props: { error: ?string, closeError: void => void }) {

  if (!props.error) {
    return null;
  }

  return (
    <div className="component-contribute__error-message">
      <button className="component-contribute__error-close" onClick={props.closeError}>
        <SvgCross />
      </button>
    </div>
  );

}


// ----- Default Props ----- //

Contribute.defaultProps = {
  error: null,
};


// ----- Exports ----- //

export default Contribute;
