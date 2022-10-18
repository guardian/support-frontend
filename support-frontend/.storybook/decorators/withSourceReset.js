import { css, Global } from '@emotion/react';
import { resets } from '@guardian/source-foundations';

export function withSourceReset(storyFn) {

	return <>
    <Global
      styles={css`
        ${resets.resetCSS}
      `}
    />
    {storyFn()}
  </>;
};
