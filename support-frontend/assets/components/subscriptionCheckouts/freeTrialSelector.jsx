// @flow
import React from 'react';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import type { Option } from 'helpers/types/option';
import { Select, Option as OptionForSelect } from '@guardian/src-select';

// ----- Styles ----- //

const marginBottom = css`
  margin-bottom: ${space[6]}px;
`;

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

// Returns an array of dates in format {key: dayNumber, value: dateDisplayString}
const getDates = (start, numDays) => {
  return Array(numDays)
    .fill(0)
    .map((_, i) => ({key: start + i, value: displayFutureDate(start + i)}));
}

// Displays the future day in a suitable dd M format (e.g. "21 September")
const displayFutureDate = (dayOffset) => {
  var futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + dayOffset);

  const dayNum = futureDate.getDate();
  const month = monthNames[futureDate.getMonth()];

  return `${dayNum} ${month}`;
}

// TODO add this to props and ensure it is wired up properly and sent to backend
const setFreeTrialLength = (value) => {
  console.log(`TODO: set props.freeTrialLength: ${value}`);
}

export default function FreeTrialSelector() {

  const lengthOfTrial = 14;
  const numDaysToDisplay = 31;
  const paymentDates = getDates(lengthOfTrial, numDaysToDisplay);

  return (
    <div id="qa-free-trial">
      <Select
        supporting={"Your free trial lasts until your chosen first payment date"}
        css={marginBottom}
        id="freeTrialLength"
        label="First Payment Date"
        value={lengthOfTrial}
        onChange={e => setFreeTrialLength(e.target.value)}
      >
        {paymentDates.map(pd =>
          <OptionForSelect value={pd.key}>{pd.value}</OptionForSelect>
        )}
      </Select>
    </div>
  );
}
