import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { until } from '@guardian/src-foundations/mq';
import { neutral } from '@guardian/src-foundations/palette';
import React from 'react';
import type { ReactNode } from 'react';

const section = css`
	max-width: 100%;
	margin: ${space[3]}px;
	padding-top: ${space[2]}px;
	padding-bottom: ${space[4]}px;
	border-top: 1px solid ${neutral['93']};

	${until.tablet} {
		:first-of-type {
			border-top: none;
		}
	}
`;
type PageSectionPropTypes = {
	id?: string;
	children: ReactNode;
};

function PageSection({ children, id }: PageSectionPropTypes): JSX.Element {
	return (
		<section id={id} css={section}>
			{children}
		</section>
	);
}

PageSection.defaultProps = {
	id: '',
};
export { PageSection };
