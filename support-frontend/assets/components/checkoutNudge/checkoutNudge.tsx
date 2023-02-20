import { css } from '@emotion/react';
import {
	brand,
	from,
	headline,
	neutral,
	space,
	textSans,
} from '@guardian/source-foundations';
import type { ContributionType } from 'helpers/contributions';
import { CheckoutNudgeCloseButton } from './checkoutNudgeButtonClose';

const container = css`
	border-radius: 12px;
	background-color: ${neutral[97]};
	margin-bottom: ${space[3]}px;
	background-size: auto 100%;
	background-repeat: no-repeat;
	background-position: right;
	background-image: url(https://media.guim.co.uk/2d33e52f89462481b77f0fd419d62a55fb70c0f0/0_0_274_202/274.png);
	${from.mobileMedium} {
		background-image: url(https://media.guim.co.uk/91d324df80b882d314dcd35f23dcffea8e346824/0_0_329_188/329.png);
	}
	${from.mobileLandscape} {
		background-image: url(https://media.guim.co.uk/2fcda5a622b598515997c0ce0ff98faffec3826d/0_0_415_188/415.png);
	}
	${from.tablet} {
		margin-top: ${space[2]}px;
		background-image: url(https://media.guim.co.uk/933daaf47129bc1ed1f9af4171d3d5a637fadf2c/0_0_419_213/419.png);
	}
	${from.desktop} {
		background-image: url(https://media.guim.co.uk/29edb4f891687e2188cc44f352372536ee41a04c/0_0_493_190/493.png);
	}
`;
const top = css`
	margin-top: ${space[2]}px;
	margin-bottom: -${space[1]}px;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	${from.mobileMedium} {
		margin-bottom: -${space[3]}px;
	}
`;
const topheading = css`
	margin-top: ${space[3]}px;
`;
const heading = (backColor: string, marginBottom: number) => css`
	margin-left: 10px;
	color: ${backColor};
	${headline.xxsmall({ fontWeight: 'bold', lineHeight: 'tight' })};
	line-height: 108%;

	${from.mobileMedium} {
		margin-left: 12px;
		margin-bottom: ${marginBottom}px;
		${headline.xsmall({ fontWeight: 'bold', lineHeight: 'tight' })};
		line-height: 108%;
	}
	${from.tablet} {
		${headline.small({ fontWeight: 'bold', lineHeight: 'tight' })};
		line-height: 108%;
	}
`;

const para = css`
	margin-top: ${space[1]}px;
	margin-left: 10px;
	margin-right: 10px;
	margin-bottom: ${space[2]}px;
	${textSans.small({ lineHeight: 'regular' })};
	line-height: 130%;
	${from.mobileMedium} {
		margin-left: 12px;
		max-width: 470px;
	}
	${from.tablet} {
		${textSans.medium({ lineHeight: 'regular' })};
		line-height: 130%;
	}
`;
const link = css`
	margin-left: 10px;
	${textSans.small({ lineHeight: 'regular' })};
	line-height: 135%;
	padding-bottom: ${space[5]}px;

	${from.mobileMedium} {
		margin-left: 12px;
	}
	${from.tablet} {
		${textSans.medium({ lineHeight: 'tight' })};
		line-height: 108%;
	}
`;
const alink = css`
		color: ${brand[500]};
		text-decoration: underline;
		&:hover {
      fontWeight:'bold';
			cursor: pointer;
		},
	`;

export type CheckoutNudgeProps = {
	contributionType: ContributionType;
	nudgeDisplay: boolean;
	nudgeTitleCopySection1: string;
	nudgeTitleCopySection2: string;
	nudgeParagraphCopy: string;
	nudgeLinkCopy: string;
	onNudgeClose: () => void;
	onNudgeClick: () => void;
};

export function CheckoutNudge({
	contributionType,
	nudgeDisplay,
	nudgeTitleCopySection1,
	nudgeTitleCopySection2,
	nudgeParagraphCopy,
	nudgeLinkCopy,
	onNudgeClose,
	onNudgeClick,
}: CheckoutNudgeProps): JSX.Element | null {
	if (contributionType === 'ONE_OFF' && nudgeDisplay) {
		return (
			<div css={container}>
				<div css={top}>
					<div css={topheading}>
						<h2 css={heading(brand[500], space[3])}>
							{nudgeTitleCopySection1}
						</h2>
					</div>
					<CheckoutNudgeCloseButton onClose={onNudgeClose} />
				</div>
				<h2 css={heading(neutral[7], 0)}>{nudgeTitleCopySection2}</h2>
				<p css={para}>{nudgeParagraphCopy}</p>
				<div css={link}>
					<a onClick={onNudgeClick} css={alink}>
						{nudgeLinkCopy}
					</a>
				</div>
			</div>
		);
	} else {
		return null;
	}
}
