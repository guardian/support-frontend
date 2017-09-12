// @flow

// ----- Imports ----- //

import React from 'react';

import InfoSection from 'components/infoSection/infoSection';
import CtaLink from 'components/ctaLink/ctaLink';


// ----- Component ----- //

export default function Ready() {

  return (
    <div className="ready-new-design gu-content-filler">
      <InfoSection className="ready-new-design__content gu-content-filler__inner">
        <h2 className="ready-new-design__heading">ready to support the Guardian?</h2>
        <CtaLink text="see supporter options" url="#" />
      </InfoSection>
    </div>
  );

}
