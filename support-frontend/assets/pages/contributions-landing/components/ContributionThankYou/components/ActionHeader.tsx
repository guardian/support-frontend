import { css } from '@emotion/react';
import { body, from } from '@guardian/source-foundations';

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

function ActionHeader({ title }: ActionHeaderProps): JSX.Element {
	return (
		<header>
			<h1 css={text}>{title}</h1>
		</header>
	);
}

export default ActionHeader;
