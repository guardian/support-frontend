import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';
import {
	brandAlt,
	from,
	headlineBold20,
	headlineBold28,
	neutral,
	space,
} from '@guardian/source/foundations';
import type { ReactElement, ReactNode } from 'react';
import { digitalSubscriptionsBlue } from 'stylesheets/emotion/colours';

const roundelSizeMob = 100;
const roundelSize = 180;

const heroRoundelStyles = css`
	display: flex;
	align-items: center;
	justify-content: center;
	text-align: center;
	/* Do not remove float! It makes the circle work! See link below */
	float: left;
	transform: translateY(-67%);
	min-width: ${roundelSizeMob}px;
	max-width: ${roundelSizeMob}px;
	width: calc(100% + ${space[1]}px);
	padding: ${space[1]}px;
	border-radius: 50%;
	${headlineBold20};

	${from.mobileMedium} {
		max-width: ${roundelSize}px;
	}

	${from.desktop} {
		width: calc(100% + ${space[6]}px);
		transform: translateY(-50%);
		${headlineBold28};
	}

	/* Combined with float on the main element, this makes the height match the content width for a perfect circle
  cf. https://medium.com/@kz228747/height-equals-width-pure-css-1c79794e470c */
	&::before {
		content: '';
		margin-top: 100%;
	}
`;
const roundelBase = css`
	background-color: ${brandAlt[400]};
	color: ${neutral[7]};
`;
const roundelDigital = css`
	background-color: ${digitalSubscriptionsBlue};
	color: ${neutral[100]};
	border: 2px solid ${brandAlt[400]};
`;
export type RoundelTheme = 'base' | 'digital';
type PropTypes = {
	children?: string | ReactNode;
	theme?: RoundelTheme;
	cssOverrides?: SerializedStyles | SerializedStyles[];
};
const themes: Record<RoundelTheme, SerializedStyles> = {
	base: roundelBase,
	digital: roundelDigital,
};

function HeroRoundel({
	children,
	cssOverrides,
	theme = 'base',
}: PropTypes): ReactElement {
	return (
		<div css={[heroRoundelStyles, themes[theme], cssOverrides]}>{children}</div>
	);
}

HeroRoundel.defaultProps = {
	theme: 'base',
};

export default HeroRoundel;
