// @flow

// ----- Imports ----- //

import React from 'react';
import type { Participations } from 'helpers/abtest';

type PropTypes = {
    abTests: Participations,
}


// ----- Component ----- //

export default function Introduction(props: PropTypes) {

  const headerCopyOptions = {
    control: {
      line1: (<span>help us deliver the</span>),
      line2: (<span>independent journalism the world&#160;needs</span>),
    },
    numberOfSupporters: {
      line1: (<span>over 800,000 readers <br /> now help fund the&#160;Guardian </span>),
      line2: (
        <span>join them today and support&#160;the
          <br />independent journalism the world needs
        </span>
      ),
    },
  };

  const introParagraphMarkup = (
    <p className="introduction-text__paragraph">
      Your support helps to make our journalism possible.
      We don&#39;t have a billionaire owner pulling the strings and we
      haven&#39;t put up a paywall. Fund independent, quality journalism
      and help us keep it open for all by making a contribution or getting a subscription.
    </p>);
  const introParagraph = props.abTests.headerCopyTest === 'howAndWhy'
    ? introParagraphMarkup
    : '';
  const headerCopy = props.abTests.headerCopyTest === 'numberOfSupporters'
    ? headerCopyOptions.numberOfSupporters
    : headerCopyOptions.control;
  return (
    <section className="introduction-text">
      <div className="introduction-text__content gu-content-margin">
        <h1 className="introduction-text__heading">{headerCopy.line1}</h1>
        <p>{headerCopy.line2}</p>
        <h1 className="introduction-text__heading">support the Guardian</h1>
        <p>contribute or subscribe</p>{introParagraph}
      </div>
    </section>
  );

}
