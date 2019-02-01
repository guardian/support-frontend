// @flow

// ----- Imports ----- //

import React from 'react';

import { getTimeTravelDaysOverride, getFlashSaleActiveOverride } from 'helpers/flashSale';

import './headerBanners.scss';


// ----- Component ----- //

const TimeTravelBanner = () => {
  const timeTravelDays = getTimeTravelDaysOverride();
  const allSalesActive = getFlashSaleActiveOverride();

  if (allSalesActive) {
    return (
      <div className="component-banner-time-travel">
        <strong>TEST MODE</strong> All flash sales are toggled on.
        The sales and prices on this page may not be currently active.
      </div>
    );
  }
  if (timeTravelDays) {
    return (
      <div className="component-banner-time-travel">
        <strong>TEST MODE</strong> You are time travelling
        {Math.abs(timeTravelDays)} days {timeTravelDays > 0 ? 'in the future' : 'in the past'}.
        The sales and prices on this page may not be currently active.
      </div>
    );
  }
  return null;
};


// ----- Exports ----- //

export default TimeTravelBanner;
