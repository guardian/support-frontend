// @flow

// ----- Imports ----- //

// $FlowIgnore - required for hooks
import React, { useState } from 'react';
import { useSwipeable, LEFT, RIGHT } from 'react-swipeable';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { headline } from '@guardian/src-foundations/typography';

import WeeklyMagazine from './weeklyMagazine';
import WeeklyFocus from './weeklyFocus';

const hasBorder = css`
  border: 1px solid #DCDCDC;
  padding: ${space[6]}px 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const stack = css`
  overflow: hidden;
  width: 100%;
  display: grid;
  grid-template-columns: [stack] 1fr;
  grid-template-rows: [headline] 80px [stack] 400px;
`;

const stackHeading = css`
  grid-area: headline / stack;
  ${headline.xxsmall({ fontWeight: 'bold' })}
  text-align: center;
  p {
    ${headline.xxxsmall()}
  }
`;

const stackedMagazine = css`
  justify-self: center;
  visibility: visible;
  user-select: none;
  grid-area: stack / stack;
  box-shadow: -2px 0 2px 0 rgba(51, 51, 51, 0.5);
  width: 200px;
  height: 350px;
  transition-timing-function: ease-out;
`;

const hiddenStack = css`
  display: none;
`;

const dismissedMagazine = css`
  transform: translateX(300%) rotate(90deg);
  visibility: hidden;
  width: 0;
  height: 0;
`;

function randomAngle() {
  const max = 10;
  const min = -max;
  return Math.floor((Math.random() * (max - min)) + min);
}

const magazines = Array.from({ length: 10 }, (_, index) => ({
  image: `https://support.thegulocal.com/assets/gwCovers/GW%20${10 - index}.png`,
  strip: `https://support.thegulocal.com/assets/gwStrips/GW%20${10 - index} Mobile strip.png`,
  rotate: randomAngle(),
  dismissed: false,
}));

function WeeklyStack() {
  const [stackedMagazines, setStackedMagazines] = useState(magazines);
  const [selectedMagazine, setSelectedMagazine] = useState<string>('');

  function unSelect() {
    setSelectedMagazine('');
  }

  const handlers = useSwipeable({
    onSwiped: (event) => {
      if (event.dir && event.dir === RIGHT) {
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
      } else if (event.dir && event.dir === LEFT) {
        setStackedMagazines((mags) => {
          const lastDismissed = mags.find(mag => mag.dismissed);
          return mags.map((mag) => {
            if (mag === lastDismissed) {
              // eslint-disable-next-line no-param-reassign
              mag.dismissed = false;
            }
            return mag;
          });
        });
      }
    },
    onTap: () => {
      const top = [...stackedMagazines].reverse().find(mag => !mag.dismissed);
      setSelectedMagazine(top.strip);
    },
    trackMouse: true,
  });

  return (
    <div css={hasBorder}>
      <div css={[stack, selectedMagazine ? hiddenStack : '']} {...handlers}>
        <div css={stackHeading}>
          <h3>The latest editions</h3>
          <p>Swipe to browse</p>
        </div>
        {stackedMagazines.map(({ image, rotate, dismissed }) =>
        (
          <WeeklyMagazine
            image={image}
            key={image}
            cssOverrides={[stackedMagazine, css`transform: rotate(${rotate}deg)`, dismissed ? dismissedMagazine : '']}
          />
         ))}
      </div>
      <WeeklyFocus image={selectedMagazine} onClose={unSelect} />
    </div>
  );
}

export default WeeklyStack;
