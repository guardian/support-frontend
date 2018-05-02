// @flow

// ----- Imports ----- //

import React from 'react';

import SvgSquaresHeroDesktop from 'components/svgs/squaresHeroDesktop';
import SvgSquaresHeroTablet from 'components/svgs/squaresHeroTablet';
import SvgSquaresHeroMobile from 'components/svgs/squaresHeroMobile';
import Highlights from 'components/highlights/highlights';


// ----- Types ----- //

type PropTypes = {
  highlights?: ?string[],
  headings: string[],
};


// ----- Component ----- //

function SquaresIntroduction(props: PropTypes) {
  return (
    <section className="component-squares-introduction">
      <SvgSquaresHeroDesktop />
      <SvgSquaresHeroTablet />
      <SvgSquaresHeroMobile />
      <div className="component-squares-introduction__content gu-content-margin">
        <Highlights highlights={props.highlights} />
        <h1 className="component-squares-introduction__heading">
          {props.headings.map(heading =>
            <span className="component-squares-introduction__heading-line">{heading}</span>)}
        </h1>
      </div>
    </section>
  );
}


// ----- Default Props ----- //

SquaresIntroduction.defaultProps = {
  highlights: null,
};


// ----- Exports ----- //

export default SquaresIntroduction;
