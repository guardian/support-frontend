// ----- Imports ----- //
import type { SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import {
	from,
	headlineBold24,
	palette,
	space,
} from '@guardian/source/foundations';
import type { ReactNode } from 'react';
import { gu_span } from 'stylesheets/emotion/layout';

// ----- Styles ----- //
const sectionStyles = css`
	/* previously .component-page-section__content extended .gu-content-margin */
	box-sizing: border-box;
	padding: 0 ${space[3]}px;

	${from.mobileLandscape} {
		max-width: ${gu_span(6)}px;
		margin: 0 auto;
		padding: 0 ${space[5]}px;
	}

	${from.phablet} {
		max-width: ${gu_span(9)}px;
	}

	${from.tablet} {
		max-width: ${gu_span(10)}px;
	}

	${from.desktop} {
		max-width: ${gu_span(12)}px;
		padding: 0 ${space[5]}px 0 ${space[10]}px;
	}

	${from.leftCol} {
		max-width: ${gu_span(14)}px;
		padding: 0 ${space[8]}px;
	}

	${from.wide} {
		max-width: ${gu_span(16)}px;
	}
`;

const headerStyles = css`
	${from.desktop} {
		display: inline-block;
		vertical-align: top;
		width: 20%;
	}
`;

const headingStyles = css`
	${headlineBold24}
	${from.desktop} {
		position: relative;

		&::after {
			border-right: 1px solid ${palette.neutral[86]};
			content: '';
			display: inline-block;
			height: 36px;
			position: absolute;
			top: 0;
			right: ${space[4]}px;
		}
	}
`;

const bodyStyles = css`
	box-sizing: border-box;

	.component-text {
		margin: ${space[9]}px 0;
	}

	${from.desktop} {
		display: inline-block;
		width: 80%;
	}
`;

function PageSection({
	heading,
	children,
	cssOverrides,
}: {
	heading?: string;
	children?: ReactNode;
	cssOverrides?: SerializedStyles;
}): JSX.Element {
	return (
		<section css={cssOverrides}>
			<div css={sectionStyles}>
				<div css={headerStyles}>
					{heading && <h2 css={headingStyles}>{heading}</h2>}
				</div>
				<div css={bodyStyles}>{children}</div>
			</div>
		</section>
	);
}

export default PageSection;
