import type { SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import { from, neutral, news } from '@guardian/source-foundations';
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

const highlightText = css`
	color: ${news[500]};
`;

const highlightTextSpacing = css`
	${from.tablet} {
		display: block;
	} ;
`;

type CheckListDataProps = {
	higherTier: boolean;
	isAustralia: boolean;
	isEmotionalBenefitTestVariant: boolean;
};

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

export const checkListData = ({
	higherTier,
	isAustralia,
	isEmotionalBenefitTestVariant,
}: CheckListDataProps): CheckListData[] => {
	const maybeGreyedOutHigherTier = higherTier ? undefined : greyedOut;

	return isEmotionalBenefitTestVariant && !isAustralia
		? [
				{
					icon: getSvgIcon(true),
					text: (
						<p>
							<span css={boldText}>Fund fearless, independent reporting </span>
							that's open and free for everyone
						</p>
					),
				},
				{
					icon: getSvgIcon(true),
					text: (
						<p>
							<span css={boldText}>Get a regular supporter newsletter </span>{' '}
							with exclusive insights from our newsroom
						</p>
					),
				},
				{
					icon: getSvgIcon(true),
					text: (
						<p>
							<span css={boldText}>See fewer asks for support </span>so you can
							read uninterrupted
						</p>
					),
				},
				{
					icon: getSvgIcon(higherTier),
					text: (
						<p>
							<span css={boldText}>Gain full access to our news app </span>to
							read our reporting on the go
						</p>
					),
					maybeGreyedOut: maybeGreyedOutHigherTier,
				},
				{
					icon: getSvgIcon(higherTier),
					text: (
						<p>
							<span css={boldText}>Read ad-free </span>on all devices
						</p>
					),
					maybeGreyedOut: maybeGreyedOutHigherTier,
				},
		  ]
		: [
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
							<span css={boldText}>Uninterrupted reading. </span> See far fewer
							asks for support
						</p>
					),
				},
				...(isAustralia
					? [
							{
								icon: getSvgIcon(higherTier),
								text: (
									<p>
										<span css={boldText}>
											Limited-edition Guardian Australia tote bag.{' '}
										</span>
										<span css={highlightTextSpacing} />
										<span css={highlightText}>Offer ends 31 May</span>
									</p>
								),
								maybeGreyedOut: maybeGreyedOutHigherTier,
							},
					  ]
					: []),
				{
					icon: getSvgIcon(higherTier),
					text: (
						<p>
							<span css={boldText}>Full access to our news app. </span>Read our
							reporting on the go
						</p>
					),
					maybeGreyedOut: maybeGreyedOutHigherTier,
				},
				{
					icon: getSvgIcon(higherTier),
					text: (
						<p>
							<span css={boldText}>Ad-free reading. </span>Avoid ads on all your
							devices
						</p>
					),
					maybeGreyedOut: maybeGreyedOutHigherTier,
				},
		  ];
};
