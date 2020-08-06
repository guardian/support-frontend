// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import { classNameWithModifiers } from 'helpers/utilities';

import TimeTravelBanner from 'components/headerBanners/timeTravelBanner';


// ----- Types ----- //

type PropTypes = {|
  id: ?string,
  header: Node,
  footer: Node | null,
  children: Node,
  classModifiers: Array<?string>,
  backgroundImageSrc: ?string,
  isAusMomentVariant: boolean,
|};


// ----- Component ----- //

export default function Page(props: PropTypes) {
  const backgroundImage = props.backgroundImageSrc ? (
    <div className="background-image-container">
      <img className="background-image" alt="landing page background illustration" src={props.backgroundImageSrc} />
    </div>
  ) : null;

    React.useEffect(() => {
      // setTimeout(() => {
        if (window.location.hash) {
          const hashElement = document.getElementById(window.location.hash.substr(1));
          if (hashElement) { hashElement.scrollIntoView(); }
        }
      // }, 1);
    }, []);

  return (
    <div id={props.id} className={classNameWithModifiers('gu-content', props.classModifiers)}>
      <TimeTravelBanner />
      {props.header}
      <main
        role="main"
        className={props.isAusMomentVariant
          ? 'gu-content__main aus-moment'
          : 'gu-content__main'
        }
      >
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
  footer: null,
  classModifiers: [],
  backgroundImageSrc: null,
  isAusMomentVariant: false,
};
