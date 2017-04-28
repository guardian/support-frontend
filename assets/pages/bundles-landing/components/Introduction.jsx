// @flow

// ----- Imports ----- //

import React from 'react';


// ----- Component ----- //

export default function Introduction() {

  return (
    <section className="introduction">
      <div className="introduction__content gu-content-margin">
        <h1 className="introduction__heading-one">support the guardian</h1>
        <p>
          Our quality journalism takes time and money to produce.
          But ad revenues are falling, so we need your help to
        </p>
        <h1 className="introduction__heading-two">secure our future</h1>
        <p>
          <span className="introduction__wrap-line">
            Subscribe or make a regular or one-off contribution&nbsp;
          </span>
          today and together we can
        </p>
        <h1 className="introduction__heading-three">hold power to account</h1>
        <p>
          <span className="introduction__wrap-line">
            As an independent voice, our most important&nbsp;
          </span>relationship is with our readers
        </p>
      </div>
    </section>
  );

}
