// @flow

// ----- Imports ----- //

// $FlowIgnore - required for hooks
import React, { useState } from 'react';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { headline } from '@guardian/src-foundations/typography';

import covers from './assets/gwCovers';
import WeeklyMagazine from './weeklyMagazine';
import WeeklyFocus from './weeklyFocus';

const hasBorder = css`
  border: 1px solid #DCDCDC;
  min-height: 500px;
  padding: ${space[4]}px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const heading = css`
  grid-area: headline / stack;
  ${headline.xxsmall({ fontWeight: 'bold' })}
  text-align: center;
  margin-bottom: ${space[6]}px;
  p {
    ${headline.xxxsmall()}
  }
`;

const newsStand = css`
  display: grid;
  grid-column-gap: ${space[4]}px;
  grid-template-rows: [top-row] 140px [overlap] 20px [bottom-row] 150px;
  visibility: visible;
  opacity: 1;
  transition: opacity 0.5s ease-in-out;
`;

const newsStandHidden = css`
  visibility: hidden;
  opacity: 0;
  height: 0;
  width: 0;

  * {
    display: none;
    opacity: 0;
  }
`;

const magazine = css`
  width: 150px;
  height: 200px;
  box-shadow: 2px -2px 8px 2px rgba(51, 51, 51, 0.5);

  :hover, :focus-visible {
    outline: none;
    cursor: pointer;
    transform: rotateY(-10deg) rotateZ(-2deg) scale(1.02) translateY(-33%);
    box-shadow: 4px 2px 8px 0 rgba(51, 51, 51, 0.8);
  }
`;

const magazineTopRow = css`
  grid-row: top-row / overlap;
`;

const magazineBottomRow = css`
  grid-row: overlap / bottom-row;
  z-index: 2;
`;

const magazineSelected = css`
  z-index: 3;
  cursor: pointer;
  box-shadow: none !important;

  &, :hover, :focus {
    transform: scale(3);
    box-shadow: none !important;
  }
`;

function WeeklyNewsstand() {
  const [selectedMagazine, setSelectedMagazine] = useState<string>('');

  function select(image: string) {
    return () => {
      setSelectedMagazine(image);
    };
  }

  function unSelect() {
    setSelectedMagazine('');
  }

  return (
    <div css={hasBorder}>
      <div css={[heading, selectedMagazine ? newsStandHidden : '']}>
        <h3>The latest editions</h3>
      </div>
      <div css={[newsStand, selectedMagazine ? newsStandHidden : '']}>
        {covers.map((image, index) =>
          (
            <WeeklyMagazine
              image={image}
              onClick={select(image)}
              cssOverrides={[magazine, index < covers.length / 2 ? magazineTopRow : magazineBottomRow, selectedMagazine === image ? magazineSelected : '']}
            />
          ))}
      </div>
      <WeeklyFocus image={selectedMagazine} onClose={unSelect} />
    </div>
  );
}

export default WeeklyNewsstand;
