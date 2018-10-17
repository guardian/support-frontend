// @flow

// ----- Imports ----- //
import React from 'react';
import Windrush from 'components/svgs/windrush';
import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';

export default function AdFreeSection() {

  return (
    <LeftMarginSection modifierClasses={['blue']}>
      <div className="component-ad-free">
        <div className="component-ad-free__content">
          <h3 className="component-ad-free__badge">New</h3>
          <h2 className="component-ad-free__header">Ad-free on all your devices</h2>
          <div className="component-ad-free__wrapper">
            <p className="component-ad-free__copy">
              Avoid the adverts and read  without interruptions when you're signed in on your apps and theguardian.com
            </p>
            <Windrush/>
          </div>
        </div>
      </div>
    </LeftMarginSection>
  );
}
