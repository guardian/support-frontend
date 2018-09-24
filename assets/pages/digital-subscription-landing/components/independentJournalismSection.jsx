// @flow

// ----- Imports ----- //
import React from 'react';
import Windrush from 'components/svgs/windrush';
import WindrushZuck from 'components/svgs/windrushZuck';
import Zuck from 'components/svgs/zuck';
import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import CtaSwitch from './ctaSwitch';

export default function IndependentJournalismSection() {

  return (
    <LeftMarginSection modifierClasses={['grey']}>
      <div className="component-independent-journalism">
        <div className="component-independent-journalism__content">
          <h2 className="component-independent-journalism__header">Your subscription helps support independent investigative journalism</h2>
          <div className="component-independent-journalism__wrapper">
            <Zuck />
            <p className="component-independent-journalism__copy">
              Independence means we can pursue a story without fear of where it might take us.
              We are dedicated to holding power
              to account, to reporting the truth,
              and exposing corruption wherever
              we find it.
            </p>
            <Windrush />
          </div>
        </div>
        <div className="component-independent-journalism__footer">
          <WindrushZuck />
          <CtaSwitch referringCta="support_digipack_page_independent_journalism_section" />
        </div>
      </div>
    </LeftMarginSection>
  );
}
