/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import { brand } from '@guardian/src-foundations';

export default function Header(): React.ReactElement {
    return (
        <div
            css={css`
                background-color: ${brand[400]};
                height: 120px;
            `}
        ></div>
    );
}
