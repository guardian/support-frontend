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
				A free book as our gift to you<sup>**</sup>{' '}
			</span>
			Choose from a selection curated by Guardian staff{' '}
			<span css={tooltipOfferStyle}>
				<Tooltip
					children={
						<p>
							{
								'Books are redeemed with a unique code from Tertulia, an online co-op bookstore loved by avid readers and writers. Instructions to redeem your free book offer will be sent to your email within 24 hours.'
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
