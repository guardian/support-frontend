import type { SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import { neutral } from '@guardian/source-foundations';
import { SvgCrossRound, SvgTickRound } from '@guardian/source-react-components';

const greyedOut = css`
	color: ${neutral[60]};

	svg {
		fill: ${neutral[60]};
	}
`;

const boldText = css`
	font-weight: bold;
`;

type TierUnlocks = {
	lowerTier: boolean;
	higherTier: boolean;
};

export type CheckListData = {
	icon: JSX.Element;
	text?: JSX.Element;
	maybeGreyedOut: null | SerializedStyles;
};

export const getSvgIcon = (isUnlocked: boolean): JSX.Element =>
	isUnlocked ? (
		<SvgTickRound isAnnouncedByScreenReader size="small" />
	) : (
		<SvgCrossRound isAnnouncedByScreenReader size="small" />
	);

export const checkListData = ({
	lowerTier,
	higherTier,
}: TierUnlocks): CheckListData[] => {
	return [
		{
			icon: getSvgIcon(lowerTier),
			text: (
				<p>
					<span css={boldText}>Uninterrupted reading. </span> No more yellow
					banners
				</p>
			),
			maybeGreyedOut: lowerTier ? null : greyedOut,
		},
		{
			icon: getSvgIcon(lowerTier),
			text: (
				<p>
					<span css={boldText}>Supporter newsletter. </span>Giving you editorial
					insight on the week’s top stories
				</p>
			),
			maybeGreyedOut: lowerTier ? null : greyedOut,
		},
		{
			icon: getSvgIcon(higherTier),
			text: (
				<p>
					<span css={boldText}>Ad-free. </span>On any device when signed in
				</p>
			),
			maybeGreyedOut: higherTier ? null : greyedOut,
		},
		{
			icon: getSvgIcon(higherTier),
			text: (
				<p>
					<span css={boldText}>Unlimited app access. </span>For the best mobile
					experience
				</p>
			),
			maybeGreyedOut: higherTier ? null : greyedOut,
		},
	];
};
