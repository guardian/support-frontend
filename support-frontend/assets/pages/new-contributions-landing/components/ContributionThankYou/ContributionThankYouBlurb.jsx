// @flow

// ----- Imports ----- //

import React from 'react';

// ----- Render ----- //

function ContributionThankYouBlurb() {

  return (
    <div className="gu-content__blurb gu-content__blurb--thank-you">
      <h1 className="gu-content__blurb-header">Thank you for a valuable contribution.</h1>
      <p className="gu-content__blurb-blurb gu-content__blurb-blurb--thank-you">
        {`Your support helps safeguard The Guardian’s editorial independence and it means we can keep our quality,
            investigative journalism open to everyone around the world.`}
      </p>
    </div>
  );
}

export { ContributionThankYouBlurb };
