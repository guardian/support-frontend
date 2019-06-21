// @flow
import React from 'react';
import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import GridImage from 'components/gridImage/gridImage';

// styles
import './adFreeSectionB.scss';

const AdFreeSectionB = () => (
  <LeftMarginSection>
    <div className="ad-free-section">

      <div className="ad-free-section__content">
        <h2 className="ad-free-section-b__sub-header">No ads, no interruptions</h2>
        <p className="ad-free-section__copy">
          Avoid the adverts and read without interruptions when you&apos;re signed in on your apps and theguardian.com
        </p>
      </div>

      <div className="ad-free-section__image-container">
        <GridImage
          gridId="noMoreAds"
          srcSizes={[482]}
          sizes="(min-width: 480px) 100%, (max-width: 660px) 100%, 100%"
          imgType="png"
        />
      </div>

    </div>
  </LeftMarginSection>
);

export default AdFreeSectionB;
