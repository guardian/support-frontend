// @flow

// ----- Imports ----- //

// $FlowIgnore - required for hooks
import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { css } from '@emotion/core';
// import { space } from '@guardian/src-foundations';

import WeeklyMagazine from './weeklyMagazine';

const stack = css`
  display: grid;
  grid-template-column: [stack] 1fr;
  grid-template-rows: [stack] 1fr;
`;

const stackedMagazine = css`
  user-select: none;
  grid-area: stack / stack;
  box-shadow: -2px 0 2px 0 rgba(51, 51, 51, 0.5);
  width: 200px;
  height: 350px;
`;

const dismissedMagazine = css`
  transform: translateX(300%);
`;

function randomAngle() {
  const max = 10;
  const min = -max;
  return Math.floor((Math.random() * (max - min)) + min);
}

const magazines = Array.from({ length: 10 }, (_, index) => ({
  image: `https://support.thegulocal.com/assets/GW%20${10 - index}.png`,
  rotate: `${randomAngle()}deg`,
  dismissed: false,
}));

function WeeklyStack() {
  const [stackedMagazines, setStackedMagazines] = useState(magazines);

  const handlers = useSwipeable({
    onSwiped: () => {
      setStackedMagazines((mags) => {
        const top = [...mags].reverse().find(mag => !mag.dismissed);
        return mags.map((mag) => {
          if (mag === top) {
            // eslint-disable-next-line no-param-reassign
            mag.dismissed = true;
          }
          return mag;
        });
      });
    },
    trackMouse: true,
  });
  // const [selectedMagazine, setSelectedMagazine] = useState<string>('');

  return (
    <div css={stack} {...handlers}>
      {stackedMagazines.map(({ image, rotate, dismissed }) =>
        (
          <WeeklyMagazine
            image={image}
            key={image}
            cssOverrides={[stackedMagazine, dismissed ? dismissedMagazine : '']}
            style={{ rotate }}
          />
         ))}
    </div>
  );
}

export default WeeklyStack;
