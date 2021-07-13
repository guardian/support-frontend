// @flow

import React, { type Node } from 'react';
import { type Option } from 'helpers/types/option';

type LandingPage = 'digitalSubscription' | 'newspaper' | 'guardianWeekly';

type TimeBoundCopy = {|
  startShowingOn: string;
  stopShowingOn?: string;
  copy: Node;
|}

type TimedCopyCollection = { [LandingPage]: TimeBoundCopy[] }

const timedCopy: TimedCopyCollection = {
  digitalSubscription: [
    {
      startShowingOn: '2021-06-11',
      stopShowingOn: '2021-07-11',
      copy: <>
        <p>
          <strong>With two innovative apps and ad-free reading,</strong> a digital subscription gives
          you the richest experience of Guardian journalism. It also sustains the independent reporting you love.
        </p>
        <p>
          Plus take a deeper dive into the Euros with our new special edition, available for a limited time only.
        </p>
      </>,
    },
  ],
};

const forceQueryKey = 'forceTimeboundCopy';

export function getTimeboundQuery(): Option<Date> {
  const { search } = window.location;

  if (search) {
    const queryList = search.replace('?', '').split('&');
    const overrideQuery = queryList.find(keyValPair => keyValPair.startsWith(forceQueryKey));
    return overrideQuery ? new Date(overrideQuery.replace(`${forceQueryKey}=`, '')) : null;
  }
  return null;
}

export function getTimeboundCopy(
  page: LandingPage,
  currentDate: Date,
  timedCopyData: TimedCopyCollection = timedCopy,
): Node {
  const copyListForPage = timedCopyData[page];
  if (copyListForPage) {
    const copyToUse = copyListForPage.find((copyForPage) => {
      const startShowingOnDate = new Date(copyForPage.startShowingOn);
      const stopShowingOnDate = copyForPage.stopShowingOn ? new Date(copyForPage.stopShowingOn) : null;
      return startShowingOnDate <= currentDate && (!stopShowingOnDate || stopShowingOnDate >= currentDate);
    });
    return copyToUse ? copyToUse.copy : null;
  }
  return null;
}
