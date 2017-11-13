// @flow

// ----- Imports ----- //

import React from 'react';

import { SvgCross } from 'components/svg/svg';

import type { Node } from 'react';


// ----- Props ----- //

type PropTypes = {
  ctaLink: Node,
  onClose: () => void,
};


// ----- Component ----- //

export default function GraveError(props: PropTypes) {

  return (
    <div className="grave-error">
      <div className="grave-error__message">
        <button className="grave-error__close" onClick={props.onClose}>
          <SvgCross />
        </button>
        <h1 className="grave-error__heading">We&#39;re sorry</h1>
        <p className="grave-error__copy">
          Your contribution using PayPal could not be processed.
          Please try again or contribute by credit/debit card.
        </p>
        {props.ctaLink}
      </div>
    </div>
  );

}
