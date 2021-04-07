/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import { neutral } from '@guardian/src-foundations/palette';
import { space } from '@guardian/src-foundations';
import { from } from '@guardian/src-foundations/mq';

type PropTypes = {
    children: React.ReactChild;
};

const block = css`
    position: relative;
    margin: ${space[6]}px 0;
    padding: ${space[9]}px 0;
    border: 1px solid ${neutral[86]};
    background-color: ${neutral[100]};
    z-index: 2;

    ${from.desktop} {
        padding: ${space[12]}px;
    }
`;

function Block(props: PropTypes): React.ReactElement {
    return <div css={block}>{props.children}</div>;
}

export default Block;
