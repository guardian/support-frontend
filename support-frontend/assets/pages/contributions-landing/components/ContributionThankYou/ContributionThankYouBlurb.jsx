// @flow

// ----- Imports ----- //

import React from 'react';
import type { IsoCountry } from 'helpers/internationalisation/country';

// ----- Types ----- //
type PropTypes = {
  countryId: IsoCountry
}

// ----- Render ----- //

const ContributionThankYouBlurb = (props: PropTypes) => (
  props.countryId && props.countryId === 'US' ? (
    <div className="gu-content__blurb gu-content__blurb--thank-you">
      <h1 className="gu-content__blurb-header">Thank you for <br className="gu-content__blurb-header-break" />making a <br
        className="gu-content__blurb-header-break"
      />year-end gift
      </h1>
      <p className="gu-content__blurb-blurb gu-content__blurb-blurb--thank-you">Every reader contribution, however big or
      small, is so valuable and brings us one step closer to hitting our $1.5 million goal.
      </p>
    </div>
  ) : (
    <div className="gu-content__blurb gu-content__blurb--thank-you">
      <h1 className="gu-content__blurb-header">Thank you for <br className="gu-content__blurb-header-break" />a valuable <br className="gu-content__blurb-header-break" />contribution</h1>
      <p className="gu-content__blurb-blurb gu-content__blurb-blurb--thank-you">
        {`Your support helps safeguard The Guardian’s editorial independence and it means we can keep our quality,
            investigative journalism open to everyone around the world`}
      </p>
    </div>
  )
);

export { ContributionThankYouBlurb };
