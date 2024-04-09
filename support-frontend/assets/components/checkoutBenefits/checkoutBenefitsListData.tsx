import type { SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import { palette } from '@guardian/source-foundations';
import { SvgCrossRound, SvgTickRound } from '@guardian/source-react-components';

const greyedOut = css`
	color: ${palette.neutral[60]};

	svg {
		fill: ${palette.neutral[60]};
	}
`;

const boldText = css`
	font-weight: bold;
`;

type TierUnlocks = {
	higherTier: boolean;
	showUnchecked?: boolean;
};

export type CheckListData = {
	isChecked: boolean;
	text?: JSX.Element;
	maybeGreyedOut?: SerializedStyles;
};

export const getSvgIcon = (isUnlocked: boolean): JSX.Element =>
	isUnlocked ? (
		<SvgTickRound isAnnouncedByScreenReader size="small" />
	) : (
		<SvgCrossRound isAnnouncedByScreenReader size="small" />
	);

export const checkListData = ({ higherTier }: TierUnlocks): CheckListData[] => {
	const maybeGreyedOutHigherTier = higherTier ? undefined : greyedOut;

	const higherTierItems = [
		{
			isChecked: higherTier,
			text: (
				<p>
					<span css={boldText}>Full access to our news app. </span>Read our
					reporting on the go
				</p>
			),
			maybeGreyedOut: maybeGreyedOutHigherTier,
		},
		{
			isChecked: higherTier,
			text: (
				<p>
					<span css={boldText}>Ad-free reading. </span>Avoid ads on all your
					devices
				</p>
			),
			maybeGreyedOut: maybeGreyedOutHigherTier,
		},
		{
			isChecked: higherTier,
			text: (
				<p>
					<span css={boldText}>Uninterrupted reading. </span> See far fewer asks
					for support
				</p>
			),
			maybeGreyedOut: maybeGreyedOutHigherTier,
		},
	];

	return [
		{
			isChecked: true,
			text: (
				<p>
					<span css={boldText}>A regular supporter newsletter. </span>Get
					exclusive insight from our newsroom
				</p>
			),
		},
		...higherTierItems,
	];
};
