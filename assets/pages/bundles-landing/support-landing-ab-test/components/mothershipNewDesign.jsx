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
           Your support helps to make our journalism possible. We don&#39;t have a
           billionaire owner pulling our strings and we havent put up a
           paywall. Fund independent, quality journalism and help us keep it
           open for all by making a contribution or getting a subscription.
          </p>
        </div>
      </div>
    </div>
  );

}
