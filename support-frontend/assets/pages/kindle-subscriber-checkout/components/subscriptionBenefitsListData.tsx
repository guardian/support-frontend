import type { SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import { SvgCrossRound, SvgTickRound } from '@guardian/source-react-components';

const boldText = css`
	font-weight: bold;
`;

export type CheckListData = {
	icon: JSX.Element;
	text?: JSX.Element;
	maybeGreyedOut?: SerializedStyles;
};

export const getSvgIcon = (isUnlocked: boolean): JSX.Element =>
	isUnlocked ? (
		<SvgTickRound isAnnouncedByScreenReader size="small" />
	) : (
		<SvgCrossRound isAnnouncedByScreenReader size="small" />
	);

export const checkListData = (): CheckListData[] => {
	return [
		{
			icon: getSvgIcon(true),
			text: (
				<p>
					<span css={boldText}>The Editions app. </span>Enjoy the Guardian and
					Observer newspaper, reimagined for mobile and tablet
				</p>
			),
		},
		{
			icon: getSvgIcon(true),
			text: (
				<p>
					<span css={boldText}>A regular supporter newsletter. </span>Get
					exclusive insight from our newsroom
				</p>
			),
		},
		{
			icon: getSvgIcon(true),
			text: (
				<p>
					<span css={boldText}>Uninterrupted reading. </span> See far fewer asks
					for support
				</p>
			),
		},
		{
			icon: getSvgIcon(true),
			text: (
				<p>
					<span css={boldText}>Full access to our news app. </span>Read our
					reporting on the go
				</p>
			),
		},
		{
			icon: getSvgIcon(true),
			text: (
				<p>
					<span css={boldText}>Ad-free reading. </span>Avoid ads on all your
					devices
				</p>
			),
		},
		{
			icon: getSvgIcon(true),
			text: (
				<p>
					<span css={boldText}>Free 14 day trial. </span>Enjoy a free trial of
					your subscription, before you pay
				</p>
			),
		},
	];
};
