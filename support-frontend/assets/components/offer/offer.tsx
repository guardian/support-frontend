import { css } from '@emotion/react';
import { from, neutral, space } from '@guardian/source/foundations';
import Feast from 'components/svgs/feast';
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
const containerStyle = css`
	display: flex;
	justify-content: space-between;
	flex-direction: row;
	border-radius: 8px;
	background-color: ${neutral[100]};
`;
const paragraphStyle = css`
	margin: ${space[2]}px ${space[2]}px ${space[3]}px;
`;
const feastStyle = css`
	margin-right: ${space[4]}px;
`;

export function OfferBook(): JSX.Element {
	return (
		<p>
			<span style={{ fontWeight: 'bold' }}>
				A free book as our gift to you
				<sup style={{ fontWeight: 'lighter', fontSize: '14px' }}>**</sup>{' '}
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

export function OfferFeast(): JSX.Element {
	return (
		<div css={containerStyle}>
			<p css={paragraphStyle}>
				Unlimited access to the Guardian Feast App{' '}
				<span css={tooltipOfferStyle}>
					<Tooltip
						children={
							<p>
								{
									'Read beyond our 20 article-per-month limit, enjoy offline access and personalised recommendations, and access our full archive of journalism. Never miss a story with the Guardian News app – a beautiful, intuitive reading experience.'
								}
							</p>
						}
						xAxisOffset={108}
						yAxisOffset={12}
						placement="bottom"
					></Tooltip>
				</span>
			</p>
			<span css={feastStyle}>
				<Feast></Feast>
			</span>
		</div>
	);
}
