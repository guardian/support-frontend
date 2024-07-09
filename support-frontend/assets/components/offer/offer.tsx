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
									'Make a feast out of anything with the Guardian’s new recipe app. Feast has thousands of recipes including quick and budget-friendly weeknight dinners, and showstopping weekend dishes – plus smart app features to make mealtimes inspiring.'
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
