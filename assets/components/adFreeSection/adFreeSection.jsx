// @flow

// ----- Imports ----- //
import React from 'react';
import GridImage from 'components/gridImage/gridImage';
import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import Heading, { type HeadingSize } from 'components/heading/heading';


// ---- Types ----- //

type PropTypes = {
  headingSize: HeadingSize,
};


// ----- Component ----- //

const getSubHeaderSize = (size: HeadingSize): HeadingSize => {
  switch (size) {
    case 1:
      return 2;
    case 2:
      return 3;
    case 3:
      return 4;
    case 4:
      return 5;
    case 5:
    case 6:
    default:
      return 6;
  }
};

export default function AdFreeSection(props: PropTypes) {

  const { headingSize } = props;

  return (
    <div className="component-ad-free-section">
      <LeftMarginSection modifierClasses={['blue']}>
        <div className="component-ad-free-section__content">
          <Heading size={getSubHeaderSize(headingSize)} className="component-ad-free-section__badge">New</Heading>
          <div className="component-ad-free-section__wrapper">
            <div className="component-ad-free-section__col">
              <Heading size={headingSize} className="component-ad-free-section__header">No ads, no interruptions</Heading>
              <p className="component-ad-free-section__copy">
                Avoid the adverts and read without interruptions
                when you&#39;re signed in on your apps and theguardian.com
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
      </LeftMarginSection>
    </div>
  );
}
