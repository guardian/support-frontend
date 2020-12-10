// @flow

import React, { type Node } from 'react';
import { hero, heroRoundel, heroImage, roundelOffset, roundelNudgeDown, roundelNudgeUp, roundelHidingPoints } from './heroStyles';

// Options for moving the roundel position on mobile
type RoundelNudgeDirection = 'up' | 'down' | 'none';
type PropTypes = {|
  image: Node,
  children: Node,
  cssOverrides?: string,
  roundelText?: Node,
  roundelNudgeDirection?: RoundelNudgeDirection,
  hideRoundelBelow?: string,
|}

const roundelNudges: { [RoundelNudgeDirection]: string } = {
  up: roundelNudgeUp,
  down: roundelNudgeDown,
  none: '',
};

function Hero({
  children, image, cssOverrides, roundelText, roundelNudgeDirection = 'up', hideRoundelBelow,
}: PropTypes) {
  const useOffset = roundelText && roundelNudgeDirection === 'up';
  const nudgeCSS = roundelNudges[roundelNudgeDirection];
  const hideRoundel = hideRoundelBelow ? roundelHidingPoints[hideRoundelBelow] : '';

  return (
    <div css={[hero, cssOverrides]}>
      {roundelText && <div css={[heroRoundel, nudgeCSS, hideRoundel]}>{roundelText}</div>}
      <div css={useOffset ? roundelOffset : ''}>
        {children}
      </div>
      <div css={heroImage}>
        {image}
      </div>
    </div>
  );
}

Hero.defaultProps = {
  cssOverrides: '',
  roundelText: null,
  roundelNudgeDirection: 'up',
  hideRoundelBelow: '',
};

export default Hero;
