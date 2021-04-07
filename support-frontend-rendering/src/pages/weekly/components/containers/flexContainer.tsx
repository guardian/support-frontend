/** @jsx jsx */
import { jsx, css, SerializedStyles } from '@emotion/react';
import { from } from '@guardian/src-foundations/mq';

type PropTypes = {
    cssOverrides?: SerializedStyles;
    children: React.ReactChild;
};

const flexContainer = css`
    display: flex;
    flex-direction: column;
    ${from.tablet} {
        flex-direction: row;
    }
`;

function FlexContainer(props: PropTypes): React.ReactElement {
    return <div css={[flexContainer, props.cssOverrides]}>{props.children}</div>;
}

FlexContainer.defaultProps = {
    cssOverrides: '',
};

export default FlexContainer;
