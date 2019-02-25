// @flow

// ----- Imports ----- //
import React from 'react';
import GridImage from 'components/gridImage/gridImage';
import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import Heading, { type HeadingSize } from 'components/heading/heading';


// ---- Types ----- //

type PropTypes = {|
  headingSize: HeadingSize,
|};


// ----- Component ----- //

export default function AdFreeSection(props: PropTypes) {

  const { headingSize } = props;

  return (
    <div className="component-ad-free-section">
      <LeftMarginSection>
        <div className="component-ad-free-section__content">
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
