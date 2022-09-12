import { css } from '@emotion/react';
import { focus, neutral, textSans } from '@guardian/source-foundations';

const skipLinkStyles = css`
	${textSans.medium()}
	height: 40px;
	top: -40px;
	line-height: 30px;
	overflow: hidden;
	padding: 0;
	position: absolute;
	background: ${neutral[100]};
	display: block;
	text-align: center;
	margin: 0;
	text-decoration: none;
	color: ${neutral[0]};
	&:focus,
	&:active {
		border: 5px solid ${focus[400]};
		position: static;
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
