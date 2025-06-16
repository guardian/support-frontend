import { css } from '@emotion/react';
import {
	neutral,
	palette,
	space,
	textSans15,
} from '@guardian/source/foundations';
import { SvgTickRound } from '@guardian/source/react-components';
import type { ReactNode } from 'react';

export const benefitsContainer = css`
	${textSans15};
	margin: ${space[5]}px 0 ${space[2]}px;
	padding-top: ${space[2]}px;
	border-top: 1px solid ${neutral[86]};
`;

export const benefitsList = css`
	padding-top: ${space[4]}px;
`;

export const benefitsItem = css`
	display: flex;
	align-items: flex-start;
	margin-bottom: ${space[4]}px;

	svg {
		flex-shrink: 0;
		margin-right: ${space[2]}px;
		fill: ${palette.brand[500]};
	}
`;

export default function BenefitsList({
	title,
	listItems = [],
}: {
	title?: ReactNode;
	listItems?: string[];
}) {
	if (listItems.length === 0) {
		return null;
	}

	return (
		<section css={benefitsContainer}>
			{title && <h4>{title}</h4>}

			<ul css={benefitsList}>
				{listItems.map((item) => (
					<li css={benefitsItem}>
						<SvgTickRound isAnnouncedByScreenReader size="xsmall" />
						{item}
					</li>
				))}
			</ul>
		</section>
	);
}
