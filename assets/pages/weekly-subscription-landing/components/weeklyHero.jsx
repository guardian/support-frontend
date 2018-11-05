// @flow

// ----- Imports ----- //

import React from 'react';
import HeadingBlock from 'components/headingBlock/headingBlock';
import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';

import WeeklyCta from './weeklyCta';


// ---- Types ----- //

type PropTypes = {|
  subsLink: string
|};


// ----- Render ----- //

const WeeklyHero = ({ subsLink }: PropTypes) => (
  <div className="weekly-hero">
    <LeftMarginSection>
      <HeadingBlock overheading="The Guardian Weekly subscriptions" heading="Seven days of international news curated to give you a clearer global perspective." />
    </LeftMarginSection>
    <div className="weekly-hero-hanger">
      <LeftMarginSection>
        <div className="weekly-hero-hanger__content">
          <WeeklyCta href={subsLink}>See Subscription options</WeeklyCta>
        </div>
      </LeftMarginSection>
    </div>

  </div>
);

export default WeeklyHero;
