import { css } from '@emotion/react';
import { from } from '@guardian/src-foundations/mq';
import { body } from '@guardian/src-foundations/typography';
import * as React from 'react';

const text = css`
	${body.medium({
		fontWeight: 'bold',
	})};

	${from.desktop} {
		font-size: 20px;
	}
`;
type ActionHeaderProps = {
	title: string;
};

const ActionHeader: React.FC<ActionHeaderProps> = ({
	title,
}: ActionHeaderProps) => (
	<header>
		<h1 css={text}>{title}</h1>
	</header>
);

export default ActionHeader;
