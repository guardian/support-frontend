// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import { classNameWithModifiers } from 'helpers/utilities';

import TimeTravelBanner from 'components/headerBanners/timeTravelBanner';


// ----- Types ----- //

type PropTypes = {|
  id: ?string,
  header: Node,
  footer: Node,
  children: Node,
  classModifiers: Array<?string>,
  backgroundImageSrc: ?string,
|};


// ----- Component ----- //

export default function Page(props: PropTypes) {
  const backgroundImage = props.backgroundImageSrc ? (
    <div className="background-image-container">
      <img className="background-image" alt="landing page background illustration" src={props.backgroundImageSrc} />
    </div>
  ) : null;

  return (
    <div id={props.id} className={classNameWithModifiers('gu-content', props.classModifiers)}>
      <TimeTravelBanner />
      {props.header}
      <main role="main" className="gu-content__main">
        {backgroundImage}
        {props.children}
      </main>
      {props.footer}
    </div>
  );

}


// ----- Default Props ----- //

Page.defaultProps = {
  id: null,
  classModifiers: [],
  backgroundImageSrc: null,
};
