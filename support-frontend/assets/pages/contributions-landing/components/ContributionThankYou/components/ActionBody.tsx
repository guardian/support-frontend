import * as React from 'react';
import { css } from '@emotion/core';
import { body } from '@guardian/src-foundations/typography';
import { from } from '@guardian/src-foundations/mq';
const bodyContainer = css`
	p,
	li {
		${body.small()};

		${from.tablet} {
			font-size: 17px;
		}
	}
`;
type ActionBodyProps = {
	children: React.ReactNode;
};

const ActionBody = ({ children }: ActionBodyProps) => (
	<div css={bodyContainer}>{children}</div>
);

export default ActionBody;
