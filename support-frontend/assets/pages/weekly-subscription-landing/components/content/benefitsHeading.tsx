import { css } from '@emotion/react';
import { headline, space } from '@guardian/source-foundations';

const heading = css`
	${headline.xsmall({
		fontWeight: 'bold',
	})}
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
