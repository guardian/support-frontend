// @flow
import React from 'react';
import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import GridImage from 'components/gridImage/gridImage';

// styles
import './adFreeSectionB.scss';

// images
import AppleAppStore from './appleAppStore.svg';
import GooglePlay from './googlePlay.svg';

const AdFreeSectionB = () => (
  <LeftMarginSection>
    <div className="ad-free-section">
      <h1 className="ad-free-section-b__header">Also included in Digital Pack</h1>
      <div className="ad-free-section__content">
        <h2 className="ad-free-section-b__sub-header">Premium App</h2>
        <p className="ad-free-section__copy">Your enhanced experience of The Guardian for mobile and tablet, with exclusive features and  ad-free reading</p>
        <div className="ad-free-section__image-container">
          <div className="ad-free-section__icon"><AppleAppStore /></div>
          <div className="ad-free-section__icon"><GooglePlay /></div>
        </div>
      </div>
      <div className="ad-free-section__content">
        <h2 className="ad-free-section-b__sub-header">No ads, no interruptions</h2>
        <p className="ad-free-section__copy">
          Avoid the adverts and read without interruptions when you&apos;re signed in on your apps and theguardian.com
        </p>
        <div className="ad-free-section__image-container">
          <GridImage
            gridId="noMoreAds"
            srcSizes={[482]}
            sizes="(min-width: 480px) 100%, (max-width: 660px) 100%, 100%"
            imgType="png"
          />
        </div>
      </div>
    </div>
  </LeftMarginSection>
);

export default AdFreeSectionB;
