/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import { space } from '@guardian/src-foundations';
import { headline } from '@guardian/src-foundations/typography';

const heading = css`
    ${headline.xsmall({ fontWeight: 'bold' })}
    overflow-wrap: break-word;
    margin-top: 0;
    margin-bottom: ${space[3]}px;
`;

type PropTypes = {
    text: string;
};

function BenefitsHeading(props: PropTypes): React.ReactElement {
    return <h2 css={heading}>{props.text}</h2>;
}

export default BenefitsHeading;
