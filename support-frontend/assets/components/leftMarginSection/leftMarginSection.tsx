// ----- Imports ----- //
<<<<<<< HEAD
import type { SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import { from } from '@guardian/source/foundations';
import type { ReactNode } from 'react';
import type { Appearance } from 'components/footerCompliant/containers/FooterContent';
import { gu_h_spacing, gu_span } from 'stylesheets/emotion/layout';

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
	flex-basis: ${gu_span(9) + gu_h_spacing}px;

	${from.desktop} {
		flex-basis: ${gu_span(10) + gu_h_spacing}px;
	}

	${from.leftCol} {
		flex-basis: ${gu_span(12) + gu_h_spacing}px;
	}
`;

const fullWidthbaseContent = css`
	margin: 0 auto;
	max-width: 1290px;
`;

export default function LeftMarginSection({
	children,
	appearance,
	cssOverrides,
}: {
=======
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
	className?: string | null | undefined;
>>>>>>> 027d42456e (remove scss from footer content)
	children: ReactNode;
	appearance?: Appearance;
	cssOverrides?: SerializedStyles;
}): JSX.Element {
	const { fullWidth } = appearance ?? {};

<<<<<<< HEAD
	return (
		<section css={!fullWidth && baseSection}>
			<div css={[fullWidth ? fullWidthbaseContent : baseContent, cssOverrides]}>
				{children}
			</div>
=======
// ----- Component ----- //
export default function LeftMarginSection({
	children,
}: PropTypes): JSX.Element {
	return (
		<section css={baseSection}>
			<div css={baseContent}>{children}</div>
>>>>>>> 027d42456e (remove scss from footer content)
		</section>
	);
}
