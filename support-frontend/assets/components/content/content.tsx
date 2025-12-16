// ----- Imports ----- //
import { css } from '@emotion/react';
import { from, palette } from '@guardian/source/foundations';
import type { ReactNode } from 'react';
import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import 'helpers/types/option';
import { gu_h_spacing, gu_v_spacing } from 'stylesheets/emotion/layout';

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
	padding: ${gu_v_spacing * 0.5}px ${gu_h_spacing * 0.5}px ${gu_v_spacing * 2}px;

	${from.desktop} {
		padding-top: ${gu_v_spacing * 2}px;
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
