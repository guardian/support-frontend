// ----- Imports ----- //
import React from "react";
import SvgSquaresHeroDesktop from "components/svgs/squaresHeroDesktop";
import SvgSquaresHeroTablet from "components/svgs/squaresHeroTablet";
import SvgSquaresHeroMobile from "components/svgs/squaresHeroMobile";
import Highlights from "components/highlights/highlights";
import type { HeadingSize } from "components/heading/heading";
import "components/heading/heading";
// ----- Types ----- //
type PropTypes = {
  highlights?: string[] | null | undefined;
  headings: string[];
  highlightsHeadingSize: HeadingSize;
};

// ----- Component ----- //
function SquaresIntroduction(props: PropTypes) {
  return <section className="component-squares-introduction">
      <SvgSquaresHeroDesktop />
      <SvgSquaresHeroTablet />
      <SvgSquaresHeroMobile />
      <div className="component-squares-introduction__content">
        <Highlights highlights={props.highlights} headingSize={props.highlightsHeadingSize} />
        <h1 className="component-squares-introduction__heading">
          {props.headings.map(heading => <span className="component-squares-introduction__heading-line">{heading}</span>)}
        </h1>
      </div>
    </section>;
}

// ----- Default Props ----- //
SquaresIntroduction.defaultProps = {
  highlights: null,
  highlightsHeadingSize: 2
}; // ----- Exports ----- //

export default SquaresIntroduction;