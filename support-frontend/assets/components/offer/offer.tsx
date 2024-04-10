import { css } from '@emotion/react';
import { from } from '@guardian/source-foundations';
import { Tooltip } from '../../../stories/content/Tooltip.stories';

const tooltipOfferStyle = css`
	> div {
		display: none;
		${from.desktop} {
			display: inline;
			margin-left: 1px;
			vertical-align: middle;
		}
	}
`;

export function OfferBook(): JSX.Element {
	return (
		<p>
			<span style={{ fontWeight: 'bold' }}>
				A free book as our gift to you.**{' '}
			</span>
			Choose from a selection curated by Guardian staff{' '}
			<span css={tooltipOfferStyle}>
				<Tooltip
					children={
						<p>
							{
								'A free book as our gift to you. Choose from a selection curated by Guardian staff.'
							}
						</p>
					}
					xAxisOffset={108}
					yAxisOffset={12}
					placement="bottom"
				></Tooltip>
			</span>
		</p>
	);
}
