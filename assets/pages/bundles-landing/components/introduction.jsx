// @flow

// ----- Imports ----- //

import React from 'react';

type PropTypes = {
  showContributeOrSubscribe: boolean
}

// ----- Component ----- //

export default function Introduction(props: PropTypes) {
  return (
    <section className="introduction-text">
      <div className="introduction-text__content gu-content-margin">
        <h1 className="introduction-text__heading">Help us deliver</h1>
        <h1 className="introduction-text__heading">the independent</h1>
        <h1 className="introduction-text__heading">journalism the</h1>
        <h1 className="introduction-text__heading">world&nbsp;needs</h1>
        <div className="introduction-text__support">
          <h1 className="introduction-text__heading introduction-text__heading--support">
            <span className="introduction-text__highlight">Support</span>
          </h1>
          <h1 className="introduction-text__heading introduction-text__heading--support">
            <span className="introduction-text__highlight">the Guardian</span>
          </h1>
        </div>
        {props.showContributeOrSubscribe
          ? <h1 className="introduction-text__heading introduction-text__heading--contribute-or-subscribe">contribute or subscribe</h1>
          : null
        }
      </div>
    </section>
  );

}
