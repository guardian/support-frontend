import { css} from '@emotion/react';
import React from 'react';

const styles = css`
   [role=banner] {
        display: none;
    }`;

export const hideTestBanner = (storyFn) => (
    <div css={styles}>{storyFn()}</div>
);