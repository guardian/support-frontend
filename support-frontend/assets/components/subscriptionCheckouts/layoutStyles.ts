import { css } from '@emotion/react';
import { from } from '@guardian/src-foundations/mq';
import { neutral } from '@guardian/src-foundations/palette';

export const mainCss = css`
	max-width: 1120px;
	${from.tablet} {
		display: flex;
		align-items: flex-start;
	}
`;
export const formCss = css`
  flex: 0 0 auto;
  width: 100%;
  ${from.tablet} {
      max-width: 490px;
      border-right: 1px solid ${neutral['86']};
    }
  ${from.leftCol} {
      max-width: 650px;
    }
  }
`;
export const asideTopCss = css`
	flex-direction: row-reverse;
`;
export const asideBottomCss = css`
	flex-direction: row;
`;
export const stickyCss = css`
	position: sticky;
	top: 0;
`;
export const asideCss = css`
	z-index: 99;
	width: 100%;
	border-bottom: 1px solid ${neutral['86']};
	${from.leftCol} {
		border-right: 1px solid ${neutral['86']};
	}
`;
