// @flow

// ----- Imports ----- //

import React from 'react';

import SvgCirclesHeroDesktop from 'components/svgs/circlesHeroDesktop';
import SvgCirclesHeroMobileLandscape from 'components/svgs/circlesHeroMobileLandscape';
import SvgCirclesHeroMobile from 'components/svgs/circlesHeroMobile';
import Highlights from 'components/highlights/highlights';
import { classNameWithModifiers } from 'helpers/utilities';

import { type HeadingSize } from 'components/heading/heading';

// ----- Types ----- //

type PropTypes = {
  headings: string[],
  highlights?: ?string[],
  modifierClasses: Array<?string>,
  highlightsHeadingSize: HeadingSize,
};


// ----- Component ----- //

function CirclesIntroduction(props: PropTypes) {

  return (
    <section className="component-circles-introduction">
      <SvgCirclesHeroDesktop />
      <SvgCirclesHeroMobileLandscape />
      <SvgCirclesHeroMobile />
      <div className={classNameWithModifiers('component-circles-introduction__content', props.modifierClasses)}>
        <h1 className={classNameWithModifiers('component-circles-introduction__heading', props.modifierClasses)}>
          {props.headings.map(heading =>
            <span className="component-circles-introduction__heading-line">{heading}</span>)}
        </h1>
        <Highlights
          highlights={props.highlights}
          modifierClasses={props.modifierClasses}
          headingSize={props.highlightsHeadingSize}
        />
      </div>
    </section>
  );

}


// ----- Default Props ----- //

CirclesIntroduction.defaultProps = {
  highlights: null,
  modifierClasses: [],
  highlightsHeadingSize: 2,
};


// ----- Exports ----- //

export default CirclesIntroduction;
