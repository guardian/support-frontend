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
  desktopAboveTheFoldVariant?: 'control' | 'variant' | 'notintest',
};


// ----- Component ----- //

function CirclesIntroduction(props: PropTypes) {
  let highlights = props.highlights;
  let modifiers = [];

  if (props.desktopAboveTheFoldVariant) {
    if (props.desktopAboveTheFoldVariant === 'variant') {
      highlights = ['Your contribution'];
      modifiers = ['variant'];
    }
  }

  return (
    <section className="component-circles-introduction">
      <SvgCirclesHeroDesktop />
      <SvgCirclesHeroMobileLandscape />
      <SvgCirclesHeroMobile />
      <div className={classNameWithModifiers('component-circles-introduction__content', modifiers) + ' gu-content-margin'}>
        <h1 className={classNameWithModifiers('component-circles-introduction__heading', modifiers)}>
          {props.headings.map(heading =>
            <span className="component-circles-introduction__heading-line">{heading}</span>)}
        </h1>
        <Highlights highlights={highlights} modifiers={modifiers} />
      </div>
    </section>
  );
}


// ----- Default Props ----- //

CirclesIntroduction.defaultProps = {
  highlights: null,
  desktopAboveTheFoldVariant: null,
};


// ----- Exports ----- //

export default CirclesIntroduction;
