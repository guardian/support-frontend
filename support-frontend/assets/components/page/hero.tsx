import type { SerializedStyles } from '@emotion/react';
import type { Breakpoint } from '@guardian/source-foundations';
import type { ReactElement, ReactNode } from 'react';
import HeroRoundel from './heroRoundel';
import {
	hero,
	heroImage,
	heroRoundelContainer,
	roundelHidingPoints,
	roundelNudgeDown,
	roundelNudgeUp,
} from './heroStyles';

// Options for moving the roundel position on mobile
type RoundelNudgeDirection = 'up' | 'down';
type PropTypes = {
	image: ReactNode;
	children: ReactNode;
	cssOverrides?: SerializedStyles;
	// You can pass either text content for the roundel, or a whole instance of a HeroRoundel component
	roundelElement?: ReactNode;
	roundelText?: ReactNode;
	roundelNudgeDirection?: RoundelNudgeDirection;
	hideRoundelBelow?: Breakpoint;
};

const roundelNudges: Record<RoundelNudgeDirection, SerializedStyles> = {
	up: roundelNudgeUp,
	down: roundelNudgeDown,
};

function Hero({
	children,
	image,
	cssOverrides,
	roundelElement,
	roundelText,
	hideRoundelBelow,
	roundelNudgeDirection = 'up',
}: PropTypes): ReactElement {
	const nudgeCSS = roundelNudges[roundelNudgeDirection];
	const hideRoundel = hideRoundelBelow
		? roundelHidingPoints[hideRoundelBelow]
		: [];
	const heroRoundelCssOverrides = [
		...(hideRoundelBelow ? [roundelHidingPoints[hideRoundelBelow]] : []),
		nudgeCSS,
	];

	return (
		<div css={[hero, cssOverrides]}>
			{roundelText && !roundelElement && (
				<div css={heroRoundelContainer}>
					<HeroRoundel cssOverrides={heroRoundelCssOverrides}>
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

export default Hero;
