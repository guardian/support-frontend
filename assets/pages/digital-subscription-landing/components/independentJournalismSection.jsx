// @flow

// ----- Imports ----- //
import React from 'react';
import AmberRudd from 'components/svgs/amberRudd';
import PriceCtaContainer from './priceCtaContainer';

export default function IndependentJournalismSection() {

  return (
    <div className="component-independent-journalism">
      <div className="component-independent-journalism__content">
        <h2 className="component-independent-journalism__header">Your subscription helps support independent investigative journalism</h2>
        <div className="middle">
          <p className="component-independent-journalism__copy">
            Independence means we can pursue a story without fear of where it might take us.
            We are dedicated to holding power
            to account, to reporting the truth,
            and exposing corruption wherever
            we find it.
          </p>
          <AmberRudd />
        </div>
      </div>
      <PriceCtaContainer />
    </div>
  );
}
