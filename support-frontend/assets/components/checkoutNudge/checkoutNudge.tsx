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
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
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
const heading = (
	color: string,
	shrinkHeadline?: boolean,
	marginBottom?: number,
) => css`
	margin-left: 9px;
	${headline.xxsmall({ fontWeight: 'bold', lineHeight: 'regular' })};
	color: ${color};

	${from.mobileMedium} {
		margin-bottom: ${marginBottom ? marginBottom : 0}px;
		font-size: ${shrinkHeadline ? '23px' : '24px'};
		line-height: 100%;
	}
	${from.tablet} {
		margin-left: 12px;
		${headline.small({ fontWeight: 'bold', lineHeight: 'tight' })};
	}
`;
const para = css`
	margin-top: ${space[1]}px;
	margin-left: 9px;
	margin-right: 10px;
	margin-bottom: ${space[2]}px;
	${textSans.small({ lineHeight: 'regular' })};

	${from.mobileMedium} {
		max-width: 470px;
	}
	${from.tablet} {
		margin-left: 12px;
		${textSans.medium({ lineHeight: 'regular' })};
	}
`;
const link = css`
	margin-left: 9px;
	${textSans.small({ lineHeight: 'regular' })};
	padding-bottom: ${space[5]}px;

	${from.tablet} {
		margin-left: 12px;
		${textSans.medium({ lineHeight: 'tight' })};
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
	nudgeTitle: string;
	nudgeSubtitle: string;
	nudgeParagraph: string;
	nudgeLinkCopy: string;
	countryGroupId: CountryGroupId;
	onNudgeClose: () => void;
	onNudgeClick: () => void;
};

export function CheckoutNudge({
	contributionType,
	nudgeDisplay,
	nudgeTitle,
	nudgeSubtitle,
	nudgeParagraph,
	nudgeLinkCopy,
	countryGroupId,
	onNudgeClose,
	onNudgeClick,
}: CheckoutNudgeProps): JSX.Element | null {
	if (contributionType === 'ONE_OFF' && nudgeDisplay) {
		return (
			<div css={container}>
				<div css={top}>
					<div css={topheading}>
						<h2 css={heading(brand[500], undefined, space[3])}>{nudgeTitle}</h2>
					</div>
					<CheckoutNudgeCloseButton onClose={onNudgeClose} />
				</div>
				<h2 css={heading(neutral[7], countryGroupId !== 'GBPCountries')}>
					{nudgeSubtitle}
				</h2>
				<p css={para}>{nudgeParagraph}</p>
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
