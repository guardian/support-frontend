import { css } from '@emotion/react';
import { headlineBold24, space } from '@guardian/source/foundations';

const heading = css`
	${headlineBold24};
	overflow-wrap: break-word;
	margin-bottom: ${space[3]}px;
`;
type PropTypes = {
	text: string;
};

function BenefitsHeading(props: PropTypes) {
	return <h2 css={heading}>{props.text}</h2>;
}

export default BenefitsHeading;
