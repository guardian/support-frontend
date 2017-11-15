// @flow

// ----- Imports ----- //

import React from 'react';

import InfoSection from 'components/infoSection/infoSection';


// ----- Component ----- //

export default function Contribute() {

  return (
    <div className="contribute-new-design" id="contribute">
      <InfoSection heading="contribute" className="contribute-new-design__content gu-content-margin">
        <p className="contribute-new-design__copy">
          Support the Guardian by making a regular or one-off contribution.
          Every penny funds our fearless, quality journalism
        </p>
      </InfoSection>
    </div>
  );

}
