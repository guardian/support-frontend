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
            <strong className="mothership-new-design__supporter-number">300,432</strong>
            others and help secure the future of independent journalism
          </h1>
          <p className="mothership-new-design__copy">
            We have no billionaire owner pulling our strings.
            Fund quality, independent journalism and hold power to account
            by making a contribution or by getting a subscription.
          </p>
        </div>
      </div>
    </div>
  );

}
