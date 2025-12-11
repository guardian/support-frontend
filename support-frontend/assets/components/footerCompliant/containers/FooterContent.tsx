// ----- Imports ----- //

import { css } from '@emotion/react';
import { from, palette, space } from '@guardian/source/foundations';
import type { ReactNode } from 'react';
import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import { gu_span } from 'stylesheets/emotion/layout';

export type Appearance = {
	centred?: boolean;
	border?: boolean;
	paddingTop?: boolean;
	fullWidth?: boolean;
};

const paddingStyle = css`
	padding-top: ${space[2]}px;
`;
const contentStyle = css`
	position: relative;
	display: flex;
	flex-grow: 1;
	flex-basis: ${space[24] * 10}px;
	padding: 0 ${space[5]}px ${space[4]}px;
	max-width: ${gu_span(9)}px;
`;

const fullWidthContentStyle = css`
	max-width: unset;
`;

function getBorderStyling(centred = false) {
	const breakpoint = centred ? from.wide : from.tablet;
	return css`
		border-bottom: 1px solid ${palette.brand[600]};
		border-bottom: 1px solid ${palette.brand[600]};
		${breakpoint} {
			border-left: 1px solid ${palette.brand[600]};
			border-right: 1px solid ${palette.brand[600]};
		}
	`;
}

function FooterContent({
	appearance,
	children,
}: {
	appearance: Appearance;
	children: ReactNode;
}): JSX.Element {
	const { centred, border, paddingTop, fullWidth } = appearance;

	return (
		<LeftMarginSection appearance={appearance}>
			<div
				css={[
					contentStyle,
					fullWidth && fullWidthContentStyle,
					paddingTop && paddingStyle,
					border && getBorderStyling(centred),
				]}
			>
				{children}
			</div>
		</LeftMarginSection>
	);
}

export default FooterContent;
