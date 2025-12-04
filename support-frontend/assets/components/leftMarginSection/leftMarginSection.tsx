// ----- Imports ----- //
import type { SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import { from } from '@guardian/source/foundations';
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
	children: ReactNode;
	appearance?: Appearance;
	cssOverrides?: SerializedStyles;
}): JSX.Element {
	const { fullWidth } = appearance ?? {};

	return (
		<section css={!fullWidth && baseSection}>
			<div css={[fullWidth ? fullWidthbaseContent : baseContent, cssOverrides]}>
				{children}
			</div>
		</section>
	);
}
