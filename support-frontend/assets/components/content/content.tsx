// ----- Imports ----- //
import { css } from '@emotion/react';
import { from, palette, space } from '@guardian/source/foundations';
import type { ReactNode } from 'react';
import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import 'helpers/types/option';

// ----- Styles ----- //
// Replacement for .component-left-margin-section__content rules in content.scss
const leftBorderStyle = css`
	max-width: 100%;
	position: relative;

	${from.tablet} {
		border-left: 1px solid ${palette.neutral[86]};
	}
`;

// Replacement for .component-content--white block-colours (simplified)
const contentWrapper = css`
	background-color: ${palette.neutral[100]};
`;

// Replacement for .component-content__content padding/max-width
const innerContent = css`
	box-sizing: border-box;
	max-width: 700px; /* approximates gu-span(9) */
	padding: ${space[2]}px ${space[3]}px 0;

	${from.desktop} {
		padding-top: ${space[4]}px;
		padding-bottom: ${space[4]}px;
	}
`;

// ----- Render ----- //
function Content({ children }: { children: ReactNode }): JSX.Element {
	return (
		<div css={contentWrapper}>
			<LeftMarginSection cssOverrides={leftBorderStyle}>
				<div css={innerContent}>{children}</div>
			</LeftMarginSection>
		</div>
	);
}

export default Content;
