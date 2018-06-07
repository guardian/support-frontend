// @flow

// ----- Imports ----- //
import React from 'react';
import PriceCtaContainer from './priceCtaContainer';

export default function IndependentJournalismSection() {
  return (
    <div className="component-independent-journalism__header">
      <h2>Your subscription helps support independent investigative journalism</h2>
      <p className="component-independent-journalism__copy">
        Independence means we can pursue a story without fear of where it might take us.
        We are dedicated to holding power
        to account, to reporting the truth,
        and exposing corruption wherever
        we find it.
      </p>
      <PriceCtaContainer />
    </div>
  );
}
