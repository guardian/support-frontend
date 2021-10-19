import type { Node } from 'react';
import React from 'react';
import type { RoundelTheme } from './heroRoundel';
import HeroRoundel from './heroRoundel';
import {
	hero,
	heroRoundelContainer,
	heroImage,
	roundelNudgeDown,
	roundelNudgeUp,
	roundelHidingPoints,
} from './heroStyles';
// Options for moving the roundel position on mobile
type RoundelNudgeDirection = 'up' | 'down' | 'none';
type PropTypes = {
	image: Node;
	children: Node;
	cssOverrides?: string;
	// You can pass either text content for the roundel, or a whole instance of a HeroRoundel component
	roundelElement?: Node;
	roundelText?: Node;
	roundelNudgeDirection?: RoundelNudgeDirection;
	hideRoundelBelow?: string;
	roundelTheme?: RoundelTheme;
};
const roundelNudges: Record<RoundelNudgeDirection, string> = {
	up: roundelNudgeUp,
	down: roundelNudgeDown,
	none: '',
};

function Hero({
	children,
	image,
	cssOverrides,
	roundelElement,
	roundelText,
	hideRoundelBelow,
	roundelNudgeDirection = 'up',
	roundelTheme = 'base',
}: PropTypes) {
	const nudgeCSS = roundelNudges[roundelNudgeDirection];
	const hideRoundel = hideRoundelBelow
		? roundelHidingPoints[hideRoundelBelow]
		: '';
	return (
		<div css={[hero, cssOverrides]}>
			{roundelText && !roundelElement && (
				<div css={heroRoundelContainer}>
					<HeroRoundel
						cssOverrides={[nudgeCSS, hideRoundel]}
						theme={roundelTheme}
					>
						{roundelText}
					</HeroRoundel>
				</div>
			)}
			{!roundelText && roundelElement && (
				<div css={[heroRoundelContainer, hideRoundel]}>{roundelElement}</div>
			)}
			<div>{children}</div>
			<div css={heroImage}>{image}</div>
		</div>
	);
}

Hero.defaultProps = {
	cssOverrides: '',
	roundelElement: null,
	roundelText: null,
	roundelNudgeDirection: 'up',
	hideRoundelBelow: '',
	roundelTheme: 'base',
};
export default Hero;
