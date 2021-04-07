/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import { from } from '@guardian/src-foundations/mq';
import { SerializedStyles } from '@emotion/utils';

type PropTypes = {
    cssOverrides?: SerializedStyles;
    children: React.ReactChild;
};

const centredContainer = css`
    position: relative;
    width: 100%;
    margin: 0 auto;
    max-width: 1290px;

    ${from.desktop} {
        width: calc(100% - 110px);
    }

    ${from.leftCol} {
        width: calc(100% - 80px);
    }
`;

function CentredContainer(props: PropTypes): React.ReactElement {
    return <div css={[centredContainer, props.cssOverrides]}>{props.children}</div>;
}

CentredContainer.defaultProps = {
    cssOverrides: '',
};

export default CentredContainer;
