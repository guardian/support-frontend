// @flow

// ----- Imports ----- //

import React from 'react';


// ----- Types ----- //

type PropTypes = {
  headings: string[],
  highlights?: string[],
};


// ----- Component ----- //

export default function CirclesIntroduction(props: PropTypes) {
  return (
    <section className="component-circles-introduction">
      <div className="component-circles-introduction__content gu-content-margin">
        <h1 className="component-circles-introduction__heading">
          {props.headings.map(heading =>
            <span className="component-circles-introduction__heading-line">{heading}</span>)}
        </h1>
        <h2 className="component-circles-introduction__heading">
          {(props.highlights || []).map(highlight => (
            <span className="component-circles-introduction__heading-line">
              <span className="component-circles-introduction__highlight">{highlight}</span>
            </span>
          ))}
        </h2>
      </div>
    </section>
  );
}


// ----- Default Props ----- //

CirclesIntroduction.defaultProps = {
  highlights: [],
};
