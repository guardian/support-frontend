// @flow

// ----- Imports ----- //

import React from 'react';
import { css } from '@emotion/core';

const magazine = css`
  display: flex;
  justify-content: center;
  text-align: center;
  width: 150px;
  height: 200px;
  transition: all 0.3s ease-in-out;

  img {
    pointer-events: none;
  }
`;

type WeeklyMagazineProps = {|
  image: string,
  style?: { [string]: string },
  onClick?: (event: MouseEvent | KeyboardEvent) => void,
  cssOverrides?: string | string[],
|}

export default function WeeklyMagazine({
  image, cssOverrides, style, onClick, ...props
}: WeeklyMagazineProps) {
  return (
    <div
      {...props}
      tabIndex="0"
      role="button"
      css={[magazine, cssOverrides]}
      style={style}
      onClick={onClick}
      onKeyDown={(event) => {
      if (event.key === 'Enter' && onClick) {
        onClick(event);
      }
    }}
    >
      <img src={image} alt="Guardian Weekly magazine" draggable={false} />
    </div>
  );
}

WeeklyMagazine.defaultProps = {
  style: {},
  onClick: () => undefined,
  cssOverrides: '',
};
