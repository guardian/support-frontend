// ----- Imports ----- //
import type { SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import { from, palette } from '@guardian/source/foundations';
import type { ReactNode } from 'react';

// ----- Styles ----- //
const baseSection = css`
	display: flex;

	${from.tablet} {
		&:before {
			content: '';
			flex-basis: 0;
			flex-grow: 1;
			display: block;
		}
	}
`;

const baseContent = css`
	flex-grow: 1;
	/*
		Original SCSS:
		flex-basis: gu-span(9) + $gu-h-spacing;
		with $gu-col-width: 60px and $gu-h-spacing: 20px
		=> 9 * 60 + 8 * 20 = 700px
	*/
	flex-basis: 700px;
	/* border-left: 1px solid ${palette.neutral[86]}; */

	${from.desktop} {
		/* gu-span(10) + $gu-h-spacing => 10 * 60 + 9 * 20 = 780px */
		flex-basis: 780px;
	}

	${from.leftCol} {
		/* gu-span(12) + $gu-h-spacing => 12 * 60 + 11 * 20 = 980px */
		flex-basis: 980px;
	}
`;

// ----- Props ----- //
type PropTypes = {
	children: ReactNode;
	cssOverrides?: SerializedStyles;
};

// ----- Component ----- //
export default function LeftMarginSection({
	children,
	cssOverrides,
}: PropTypes): JSX.Element {
	return (
		<section css={baseSection}>
			<div css={[baseContent, cssOverrides]}>{children}</div>
		</section>
	);
}
