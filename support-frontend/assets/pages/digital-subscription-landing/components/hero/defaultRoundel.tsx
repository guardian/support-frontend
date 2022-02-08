import { css } from '@emotion/react';
import { space } from '@guardian/src-foundations';
import { from } from '@guardian/src-foundations/mq';
import { headline } from '@guardian/src-foundations/typography';
import React from 'react';

export const circleTextTop = css`
	${headline.xsmall({
		fontWeight: 'bold',
	})};

	${from.mobileLandscape} {
		${headline.medium({
			fontWeight: 'bold',
		})};
	}
`;
export const circleTextBottom = css`
	${headline.xxxsmall({
		fontWeight: 'bold',
	})};

	${from.mobileLandscape} {
		${headline.xsmall({
			fontWeight: 'bold',
		})};
	}
`;
export const circleTextContainer = css`
	padding: ${space[2]}px;

	${from.tablet} {
		padding: ${space[1]}px;
	}
`;

function DefaultRoundel() {
	return (
		<div css={circleTextContainer}>
			<div css={circleTextTop}>14 day</div>
			<div css={circleTextBottom}>free trial</div>
		</div>
	);
}

export default DefaultRoundel;
