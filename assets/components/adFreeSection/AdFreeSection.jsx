// @flow

// ----- Imports ----- //
import React from 'react';
import GridImage from 'components/gridImage/gridImage';
import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';

export default function AdFreeSection() {

  return (
    <LeftMarginSection modifierClasses={['blue']}>
      <div className="component-ad-free">
        <div className="component-ad-free__content">
          <h3 className="component-ad-free__badge">New</h3>
          <div className="component-ad-free__wrapper">
            <div className="component-ad-free__col">
              <h2 className="component-ad-free__header">Ad-free on all your devices</h2>
              <p className="component-ad-free__copy">
                {`Avoid the adverts and read without interruptions when you're signed in on your apps and theguardian.com`}
              </p>
            </div>
            <GridImage
              gridId="adFreePromotionCircles"
              srcSizes={[1000, 500, 140]}
              sizes="(max-width: 740px) 100vw, 400px"
              imgType="png"
            />
          </div>
        </div>
      </div>
    </LeftMarginSection>
  );
}
