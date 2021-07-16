import React, { ReactNode } from 'react';

import { css } from '@emotion/core';
import { from } from '@guardian/src-foundations/mq';
import { SerializedStyles } from '@emotion/react';

type PropTypes = {
	cssOverrides?: SerializedStyles;
	children: ReactNode;
};
const flexContainer = css`
	display: flex;
	flex-direction: column;
	${from.tablet} {
		flex-direction: row;
	}
`;

function FlexContainer({ cssOverrides, children }: PropTypes) {
	return <div css={[flexContainer, cssOverrides]}>{children}</div>;
}

FlexContainer.defaultProps = {
	cssOverrides: '',
};
export default FlexContainer;
