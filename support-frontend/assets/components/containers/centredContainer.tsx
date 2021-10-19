import type { Node } from 'react';
import React from 'react';
import { css } from '@emotion/core';
import { from } from '@guardian/src-foundations/mq';
type PropTypes = {
	cssOverrides?: string;
	children: Node;
};
const centredContainer = css`
	position: relative;
	width: 100%;
	margin: 0 auto;
	max-width: 1290px;

	${from.desktop} {
		width: calc(100% - 110px);
	}

	${from.leftCol} {
		width: calc(100% - 80px);
	}
`;

function CentredContainer(props: PropTypes) {
	return (
		<div css={[centredContainer, props.cssOverrides]}>{props.children}</div>
	);
}

CentredContainer.defaultProps = {
	cssOverrides: '',
};
export default CentredContainer;
