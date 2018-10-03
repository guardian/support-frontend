// @flow

// ----- Imports ----- //

import React from 'react';
import Highlights from 'components/highlights/highlights';
import GridPicture from '../gridPicture/gridPicture';


// ----- Component ----- //

function InvestIntroduction() {

  return (
    <section className="component-invest-introduction">
      <div className="component-invest-introduction__content">
      <GridPicture
        sources={[
          {
            gridId: 'investHeaderMobile',
            srcSizes: [140, 500, 1000, 1875],
            sizes: '100vw',
            media: '(max-width: 659px)',
          },
          {
            gridId: 'investHeaderDesktop',
            srcSizes: [140, 500, 1000, 2000],
            sizes: '(min-width: 1140px) 1500px, (min-width: 980px) 1200px, (min-width: 740px) 1000px, (min-width: 660px) 800px, 100vw',
            media: '(min-width: 660px)',
          },
        ]}
        fallback="investHeaderDesktop"
        fallbackSize={2000}
        fallbackImgType="jpg"
      />
        <Highlights
          highlights={['You invest,', 'we investigate']}
          headingSize={1}
          modifierClasses={['invest-heading']}
        />
        <Highlights
          highlights={['Subscriptions from The Guardian']}
          headingSize={2}
          modifierClasses={['invest-sub-heading']}
        />
      </div>
    </section>
  );

}


// ----- Default Props ----- //

InvestIntroduction.defaultProps = {
  highlights: null,
  modifierClasses: [],
  highlightsHeadingSize: 2,
};


// ----- Exports ----- //

export default InvestIntroduction;
