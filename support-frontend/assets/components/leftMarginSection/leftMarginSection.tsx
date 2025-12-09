// ----- Imports ----- //
import type { SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import { from } from '@guardian/source/foundations';
import type { ReactNode } from 'react';
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

export default function LeftMarginSection({
	children,
	cssOverrides,
}: {
	children: ReactNode;
	cssOverrides?: SerializedStyles;
}): JSX.Element {
	return (
		<section css={baseSection}>
			<div css={[baseContent, cssOverrides]}>{children}</div>
		</section>
	);
}
