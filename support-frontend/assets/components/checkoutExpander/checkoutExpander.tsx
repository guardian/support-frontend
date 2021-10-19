// ----- Imports ----- //
import type { Node } from 'react';
import React from 'react';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { textSans } from '@guardian/src-foundations/typography';
const expander = css`
	summary::-webkit-details-marker {
		display: none;
	}
`;
const summary = css`
	display: block;
	cursor: pointer;
	margin: ${space[1]}px 0;
`;
const copyStyleLabel = css`
	${textSans.medium({
		fontWeight: 'bold',
	})};
	text-decoration: underline;
`;
const copyStyle = css`
	${textSans.medium()};
`;
// ----- Types ----- //
type ExpanderPropTypes = {
	copy: string;
	children: Node;
};

// ----- Component ----- //
const CheckoutExpander = ({ copy, children }: ExpanderPropTypes) => (
	<details css={expander}>
		<summary css={summary}>
			<strong css={copyStyleLabel}>{copy}</strong>
		</summary>
		<div css={copyStyle}>{children}</div>
	</details>
); // ----- Exports ----- //

export default CheckoutExpander;
