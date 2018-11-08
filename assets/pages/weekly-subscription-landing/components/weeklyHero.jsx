// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import HeadingBlock from 'components/headingBlock/headingBlock';
import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import GridImage from 'components/gridImage/gridImage';
import SvgWeeklyHeroCircles from 'components/svgs/weeklyHeroCircles';


// ---- Types ----- //

type PropTypes = {|
  overheading: string,
  heading: string,
  headline: string | null,
  cta: Node | null,
|};


// ----- Render ----- //

const WeeklyHero = ({
  headline, overheading, heading, cta,
}: PropTypes) => (
  <header>
    <div className="weekly-hero">
      <LeftMarginSection>
        {headline &&
        <p className="weekly-hero__headline">
          {headline}
        </p>
        }
        <GridImage
          gridId="weeklyLandingHero"
          srcSizes={[1000, 500]}
          sizes="(max-width: 740px) 90vw, 500px"
          imgType="png"
        />
        <SvgWeeklyHeroCircles />
        <HeadingBlock overheading={overheading} heading={heading} />
      </LeftMarginSection>
    </div>
    {cta &&
    <div className="weekly-hero-hanger">
      <LeftMarginSection>
        <div className="weekly-hero-hanger__content">
          {cta}
        </div>
      </LeftMarginSection>
    </div>
    }
  </header>
);

export default WeeklyHero;
