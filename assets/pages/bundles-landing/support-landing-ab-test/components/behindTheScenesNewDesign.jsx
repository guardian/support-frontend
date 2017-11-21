// @flow

// ----- Imports ----- //

import React from 'react';

import InfoSection from 'components/infoSection/infoSection';
import { SvgMovingCircle } from 'components/svg/svg';


// ----- Component ----- //

export default function BehindTheScenes() {

  return (
    <div className="behind-the-scenes-new-design">
      <InfoSection
        className="behind-the-scenes-new-design__content gu-content-margin"
        heading="...and go behind the scenes"
        headingContent={<SvgMovingCircle />}
      >
        <p className="behind-the-scenes-new-design__copy">
          Everyone who supports the Guardian can experience it up close with
          emails from our newsroom and the opportunity to participate
        </p>
      </InfoSection>
    </div>
  );

}
