// @flow

// ----- Imports ----- //

// $FlowIgnore - required for hooks
import React, { useState } from 'react';
import { css } from '@emotion/core';
import { neutral } from '@guardian/src-foundations/palette';
import { space } from '@guardian/src-foundations';

const newsStand = css`
  display: grid;
  grid-template-columns: repeat(3, minmax(150px, 1fr));
  grid-column-gap: ${space[2]}px;
  grid-template-rows: [top-row] 110px [overlap] 40px [bottom-row] 150px;
`;

const magazine = css`
  display: block;
  border: 1px solid ${neutral[20]};
  width: 150px;
  height: 200px;
  transition: all 0.3s ease-in-out;
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

const magazines = Array.from({ length: 6 }, () => `#${Math.floor(Math.random() * 16777215).toString(16)}`);

function WeeklyNewsstand() {
  const [selectedMagazine, setSelectedMagazine] = useState<string>('');

  return (
    <div css={newsStand}>
      {magazines.map((backgroundColor, index) =>
        (<button
          onClick={() => {
            if (selectedMagazine === backgroundColor) {
              setSelectedMagazine('');
            } else {
              setSelectedMagazine(backgroundColor);
            }
          }}
          css={[magazine, index < 3 ? magazineTopRow : magazineBottomRow, selectedMagazine === backgroundColor ? magazineSelected : '']}
          style={{ backgroundColor }}
        />))}
    </div>
  );
}

export default WeeklyNewsstand;
