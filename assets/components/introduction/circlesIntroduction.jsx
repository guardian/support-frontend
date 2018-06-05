// @flow

// ----- Imports ----- //

import React from 'react';

import SvgCirclesHeroDesktop from 'components/svgs/circlesHeroDesktop';
import SvgCirclesHeroMobileLandscape from 'components/svgs/circlesHeroMobileLandscape';
import SvgCirclesHeroMobile from 'components/svgs/circlesHeroMobile';
import Highlights from 'components/highlights/highlights';
import { classNameWithModifiers } from 'helpers/utilities';


// ----- Types ----- //

type PropTypes = {
  headings: string[],
  highlights?: ?string[],
  modifierClasses: Array<?string>,
};


// ----- Component ----- //

function CirclesIntroduction(props: PropTypes) {

  return (
    <section className="component-circles-introduction">
      <SvgCirclesHeroDesktop />
      <SvgCirclesHeroMobileLandscape />
      <SvgCirclesHeroMobile />
      <div className={`${classNameWithModifiers('component-circles-introduction__content', props.modifierClasses)} gu-content-margin`}>
        <h1 className={classNameWithModifiers('component-circles-introduction__heading', props.modifierClasses)}>
          {props.headings.map(heading =>
            <span className="component-circles-introduction__heading-line">{heading}</span>)}
        </h1>
        <Highlights highlights={props.highlights} modifierClasses={props.modifierClasses} />
      </div>
    </section>
  );

}


// ----- Default Props ----- //

/* eslint-disable react/default-props-match-prop-types */
CirclesIntroduction.defaultProps = {
  highlights: null,
  modifierClasses: [],
};
/* eslint-enable react/default-props-match-prop-types */


// ----- Exports ----- //

export default CirclesIntroduction;
