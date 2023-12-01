import { css } from '@emotion/react';
import { from } from '@guardian/source-foundations';

const MAX_DISPLAY_NAME_LENGTH = 10;

const containerCss = css`
	font-size: 24px;
	${from.tablet} {
		font-size: 34px;
	}
`;

interface HeadingProp {
	name: string | null;
}

function Heading({ name }: HeadingProp): JSX.Element {
	const maybeNameCommaAndSpacing: string =
		name && name.length < MAX_DISPLAY_NAME_LENGTH ? `, ${name}, ` : ` `;
	return (
		<div css={containerCss}>
			Thank you{maybeNameCommaAndSpacing}for subscribing to the digital edition
		</div>
	);
}

export default Heading;
