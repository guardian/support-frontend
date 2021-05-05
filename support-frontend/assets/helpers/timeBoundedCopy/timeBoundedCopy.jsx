// @flow

import React, { type Node } from 'react';

type LandingPage = 'digitalSubscription' | 'newspaper' | 'guardianWeekly';

type TimeBoundCopy = {|
  start: string;
  end?: string;
  copy: Node;
|}

type TimedCopyCollection = { [LandingPage]: TimeBoundCopy[] }

const timedCopy: TimedCopyCollection = {
  digitalSubscription: [
    {
      start: '2021-05-08',
      copy: <>
        <p>
          <strong>With two innovative apps and ad-free reading,</strong> a digital subscription gives
          you the richest experience of Guardian journalism. It also sustains the independent reporting you love.
        </p>
        <p>
          Plus celebrate our 200th birthday with our special edition, We were there, available for a limited time.
        </p>
      </>,
    },
  ],
};

export function getTimeboundCopy(
  page: LandingPage,
  currentDate: Date,
  timedCopyData: TimedCopyCollection = timedCopy,
): Node {
  const copyListForPage = timedCopyData[page];
  if (copyListForPage) {
    const copyToUse = copyListForPage.find((copyForPage) => {
      const startDate = new Date(copyForPage.start);
      const endDate = copyForPage.end ? new Date(copyForPage.end) : null;
      return startDate <= currentDate && (!endDate || endDate >= currentDate);
    });
    return copyToUse ? copyToUse.copy : null;
  }
  return null;
}
