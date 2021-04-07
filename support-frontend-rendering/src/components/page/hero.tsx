/** @jsx jsx */
import { jsx, SerializedStyles } from '@emotion/react';
import { Breakpoint } from '@guardian/src-foundations/dist/types/mq';
import React from 'react';
import {
    hero,
    heroRoundel,
    heroRoundelContainer,
    heroImage,
    roundelOffset,
    roundelNudgeDown,
    roundelNudgeUp,
    roundelHidingPoints,
} from './heroStyles';

// Options for moving the roundel position on mobile
type RoundelNudgeDirection = 'up' | 'down' | 'none';
type PropTypes = {
    image: React.ReactChild;
    children: React.ReactChild;
    cssOverrides?: string;
    roundelText?: React.ReactChild;
    roundelNudgeDirection?: RoundelNudgeDirection;
    hideRoundelBelow?: Breakpoint;
};

const roundelNudges: { [key in RoundelNudgeDirection]: SerializedStyles | string } = {
    up: roundelNudgeUp,
    down: roundelNudgeDown,
    none: '',
};

function Hero({
    children,
    image,
    cssOverrides,
    roundelText,
    roundelNudgeDirection = 'up',
    hideRoundelBelow,
}: PropTypes): React.ReactElement {
    const useOffset = roundelText && roundelNudgeDirection === 'up';
    const nudgeCSS = roundelNudges[roundelNudgeDirection];
    const hideRoundel = hideRoundelBelow ? roundelHidingPoints[hideRoundelBelow] : '';

    return (
        <div css={[hero, cssOverrides]}>
            {roundelText && (
                <div css={heroRoundelContainer}>
                    <div css={[heroRoundel, nudgeCSS, hideRoundel]}>{roundelText}</div>
                </div>
            )}
            <div css={useOffset ? roundelOffset : ''}>{children}</div>
            <div css={heroImage}>{image}</div>
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
