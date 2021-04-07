import React from 'react';
import { Global, css } from '@emotion/react';
import emotionNormalize from 'emotion-normalize';

export default function Page(): React.ReactElement {
    return (
        <>
            <Global
                styles={css`
                    ${emotionNormalize}
                    html, body {
                        padding: 0;
                        margin: 0;
                        background: white;
                        min-height: 100%;
                    }
                `}
            />
            <div id="top"></div>
        </>
    );
}
