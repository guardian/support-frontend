// @flow

// ----- Imports ----- //

// $FlowIgnore - required for hooks
import React, { useState } from 'react';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';

import WeeklyMagazine from './weeklyMagazine';
import WeeklyFocus from './weeklyFocus';

const newsStand = css`
  display: grid;
  grid-column-gap: ${space[2]}px;
  grid-template-rows: [top-row] 140px [overlap] 20px [bottom-row] 150px;
  visibility: visible;
  opacity: 1;
  transition: opacity 0.5s ease-in-out;
`;

const newsStandHidden = css`
  visibility: hidden;
  opacity: 0;
  height: 0;

  * {
    display: none;
  }
`;

const magazine = css`
  box-shadow: 2px 0 2px 0 rgba(51, 51, 51, 0.5);

  :hover, :focus-visible {
    outline: none;
    cursor: pointer;
    transform: rotateY(-10deg) rotateZ(-2deg) scale(1.02) translateY(-33%);
    -webkit-backface-visibility: hidden;
    box-shadow: 4px 2px 0 0 rgba(51, 51, 51, 0.8);
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

  &, :hover, :focus {
    transform: scale(3);
    box-shadow: none;
  }
`;

const magazines = Array.from({ length: 10 }, (_, index) => `https://support.thegulocal.com/assets/GW%20${index + 1}.png`);

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
    <div>
      <div css={[newsStand, selectedMagazine ? newsStandHidden : '']}>
        {magazines.map((image, index) =>
          (
            <WeeklyMagazine
              image={image}
              onClick={select(image)}
              cssOverrides={[magazine, index < magazines.length / 2 ? magazineTopRow : magazineBottomRow, selectedMagazine === image ? magazineSelected : '']}
            />
          ))}
      </div>
      <WeeklyFocus image={selectedMagazine} onClose={unSelect} />
    </div>
  );
}

export default WeeklyNewsstand;
