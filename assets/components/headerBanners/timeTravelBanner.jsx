// @flow

// ----- Imports ----- //

import React from 'react';

import { getTimeTravelDays } from 'helpers/flashSale';

import './headerBanners.scss';


// ----- Component ----- //

const TimeTravelBanner = () => {
  const timeTravelDays = getTimeTravelDays();

  return timeTravelDays && (
    <div className="component-banner-time-travel">
      You are time travelling to {Math.abs(timeTravelDays)} days {timeTravelDays > 0 ? 'in the future' : 'in the past'}. The sales and prices on this page may not be currently active.
    </div>
  );
};


// ----- Exports ----- //

export default TimeTravelBanner;
