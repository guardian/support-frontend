// @flow

import React from 'react';
import { initTicker } from 'helpers/ticker.js';

initTicker();

export function ContributionsTickerTemplate() {
  return (
    <div class="contributions-landing-ticker">
      <div class="contributions-landing-ticker__so-far">
        <div class="contributions-landing-ticker__count"></div>
        <div class="contributions-landing-ticker__count-label">contributed</div>
      </div>

      <div class="contributions-landing-ticker__goal">
        <div class="contributions-landing-ticker__count"></div>
        <div class="contributions-landing-ticker__count-label">our goal</div>
      </div>

      <div class="contributions-landing-ticker__progress">
        <div class="contributions-landing-ticker__filled-progress"></div>
      </div>
    </div>
  );
};
