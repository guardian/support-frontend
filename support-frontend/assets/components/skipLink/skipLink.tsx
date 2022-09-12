import { css } from '@emotion/react';
import { focus, neutral, textSans } from '@guardian/source-foundations';

const skipLinkStyles = css`
	${textSans.medium()}
	display: block;
	position: absolute;
	height: 40px;
	top: -40px;
	padding: 0;
	margin: 0;
	line-height: 30px;
	overflow: hidden;
	background: ${neutral[100]};
	color: ${neutral[0]};
	text-align: center;
	text-decoration: none;

	&:focus,
	&:active {
		position: static;
		border: 5px solid ${focus[400]};
	}
	&:visited,
	&:active {
		color: ${neutral[0]};
	}
`;

type Identifier = 'maincontent' | 'navigation';

type SkipLinkProps = {
	id: Identifier;
	label: string;
};

export function SkipLink({ id, label }: SkipLinkProps): JSX.Element {
	return (
		<a href={`#${id}`} css={skipLinkStyles}>
			{label}
		</a>
	);
}
