import { css } from '@emotion/react';
import { from } from '@guardian/src-foundations/mq';
import { body } from '@guardian/src-foundations/typography';
import * as React from 'react';

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

const ActionBody: React.FC<ActionBodyProps> = ({
	children,
}: ActionBodyProps) => <div css={bodyContainer}>{children}</div>;

export default ActionBody;
