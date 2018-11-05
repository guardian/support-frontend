// @flow

// ----- Imports ----- //

import React from 'react';
import HeadingBlock from 'components/headingBlock/headingBlock';
import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';

import WeeklyCtaButton from './weeklyCtaButton';

// ----- Render ----- //

const WeeklyHero = () => (
  <div className="component-weekly-hero">
    <LeftMarginSection>
      <HeadingBlock overheading="The Guardian Weekly subscriptions" heading="Seven days of international news curated to give you a clearer global perspective." />
    </LeftMarginSection>
    <div className="component-weekly-hero-hanger">
      <LeftMarginSection>
        <div className="component-weekly-hero-hanger__content">
          <WeeklyCtaButton>See Subscription options</WeeklyCtaButton>
        </div>
      </LeftMarginSection>
    </div>

  </div>
);

export default WeeklyHero;
