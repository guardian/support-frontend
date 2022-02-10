import { css } from '@emotion/react';
import { body, from } from '@guardian/source-foundations';
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
