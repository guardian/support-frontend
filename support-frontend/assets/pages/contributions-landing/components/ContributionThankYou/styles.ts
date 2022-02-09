import { css } from '@emotion/react';
import { from } from '@guardian/source-foundations';

const hideAfterDesktop = css`
	display: block;

	${from.desktop} {
		display: none;
	}
`;
const hideBeforeDesktop = css`
	display: none;

	${from.desktop} {
		display: block;
	}
`;
const hideAfterTablet = css`
	display: block;

	${from.tablet} {
		display: none;
	}
`;
const hideBeforeTablet = css`
	display: none;

	${from.tablet} {
		display: block;
	}
`;
export default {
	hideAfterDesktop,
	hideBeforeDesktop,
	hideAfterTablet,
	hideBeforeTablet,
};
