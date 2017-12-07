// @flow

// ----- Imports ----- //

import React from 'react';

import { SvgGasParticles } from 'components/svg/svg';


// ----- Component ----- //

export default function Mothership() {

  return (
    <div className="mothership-new-design">
      <div className="mothership-new-design__content gu-content-margin">
        <SvgGasParticles />
        <div className="mothership-new-design__circle">
          <h1 className="mothership-new-design__heading">
            join over
            <strong className="mothership-new-design__supporter-number">800,000</strong>
            readers and help us deliver the independent journalism the world needs
          </h1>
          <p className="mothership-new-design__copy">
           Your support helps to make our journalism possible, without paywalls
           or billionaire owners. Fund us today by making a contribution or
           getting a subscription.
          </p>
        </div>
      </div>
    </div>
  );

}
