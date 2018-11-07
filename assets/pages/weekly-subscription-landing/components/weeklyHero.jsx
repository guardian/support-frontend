// @flow

// ----- Imports ----- //

import React from 'react';
import HeadingBlock from 'components/headingBlock/headingBlock';
import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';

import SvgChevron from 'components/svgs/chevron';

import WeeklyCta from './weeklyCta';


// ---- Types ----- //

type PropTypes = {|
  subsLink: string
|};


// ----- Render ----- //

const WeeklyHero = ({ subsLink }: PropTypes) => (
  <header>
    <div className="weekly-hero">
      <LeftMarginSection>
        <p className="weekly-hero__headline">
          The essential new
          Weekly magazine
          from The Guardian
        </p>
        <HeadingBlock overheading="The Guardian Weekly subscriptions" heading="Seven days of international news curated to give you a clearer global perspective." />
      </LeftMarginSection>
    </div>
    <div className="weekly-hero-hanger">
      <LeftMarginSection>
        <div className="weekly-hero-hanger__content">
          <WeeklyCta icon={<SvgChevron />} href={subsLink}>See Subscription options</WeeklyCta>
        </div>
      </LeftMarginSection>
    </div>

  </header>
);

export default WeeklyHero;
