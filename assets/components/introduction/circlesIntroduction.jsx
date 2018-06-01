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
  modifiers?: Array<?string>,
};


// ----- Component ----- //

function CirclesIntroduction(props: PropTypes) {
  const modifiers = props.modifiers || [];
  return (
    <section className="component-circles-introduction">
      <SvgCirclesHeroDesktop />
      <SvgCirclesHeroMobileLandscape />
      <SvgCirclesHeroMobile />
      <div className={`${classNameWithModifiers('component-circles-introduction__content', modifiers)} gu-content-margin`}>
        <h1 className={classNameWithModifiers('component-circles-introduction__heading', modifiers)}>
          {props.headings.map(heading =>
            <span className="component-circles-introduction__heading-line">{heading}</span>)}
        </h1>
        <Highlights highlights={props.highlights} modifiers={modifiers} />
      </div>
    </section>
  );
}


// ----- Default Props ----- //

CirclesIntroduction.defaultProps = {
  highlights: null,
  modifiers: [],
};


// ----- Exports ----- //

export default CirclesIntroduction;
