// @flow

// ----- Imports ----- //

import React from 'react';

import Countdown from 'components/countdown/countdown';
import { getEndTime } from 'helpers/flashSale';

// ----- Render ----- //

export default () => (
  <div className="component-flash-sale-countdown">
    <span className="component-flash-sale-countdown__chip component-flash-sale-countdown__chip--time">
      <Countdown to={getEndTime()} />
    </span>
    <span className="component-flash-sale-countdown__chip component-flash-sale-countdown__chip--help">
      Until flash sale ends
    </span>
  </div>
);
