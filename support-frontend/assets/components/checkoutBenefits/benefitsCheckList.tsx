import type { SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import {
	from,
	palette,
	space,
	textSans15,
	textSans17,
} from '@guardian/source/foundations';
import {
	SvgCrossRoundFilled,
	SvgTickRound,
} from '@guardian/source/react-components';
import Tooltip from 'components/tooltip/Tooltip';
import { BenefitPill } from './benefitPill';
import BulletSvg from './bulletSvg';

const benefitHeadingCss = css`
	font-weight: bold;
	margin: ${space[2]}px 0px ${space[3]}px;
`;

const checkListIconCss = (style: CheckListStyle) => css`
	vertical-align: top;
	padding-right: ${style === 'compact' ? '4px' : '10px'};
	line-height: 0;
`;

const checkListIconColor = (color: string) => css`
	svg {
		fill: ${color};
	}
`;

const iconContainerCss = css`
	margin-top: -2px;
`;

const checkListTextCss = css`
	& p {
		line-height: 1.35;
	}
`;

export const checkListTextItemCss = css`
	& div {
		display: none;

		${from.desktop} {
			display: inline;
			margin-left: 1px;
		}
	}
	strong {
		font-weight: bold;
	}
`;
const listCss = (style: CheckListStyle) => css`
	strong {
		font-weight: bold;
	}
	${style === 'standard'
		? css`
				${textSans17};
				line-height: 1.15;
		  `
		: textSans15};

	& li:not(:last-child) {
		border-bottom: 6px solid transparent;
	}

	${from.mobileLandscape} {
		& li:not(:last-child) {
			border-bottom: ${space[3]}px solid transparent;
		}
	}
`;
const opaqueCss = css`
	opacity: 0;
`;

export type BenefitsCheckListData = {
	isChecked: boolean;
	text?: JSX.Element | string;
	maybeGreyedOut?: SerializedStyles;
	toolTip?: string;
	strong?: boolean;
	isNew?: boolean;
	hideBullet?: boolean;
	pill?: string;
};

type CheckListStyle = 'standard' | 'compact' | 'hidden' | 'bullet';

export type BenefitsCheckListProps = {
	benefitsCheckListData: BenefitsCheckListData[];
	benefitsHeading?: string;
	style?: CheckListStyle;
	iconColor?: string;
	cssOverrides?: SerializedStyles;
};

function ChecklistItemIcon({
	checked,
	style,
}: {
	checked: boolean;
	style: CheckListStyle;
}): JSX.Element {
	const styleSize = style === 'standard' ? 'small' : 'xsmall';
	return style === 'bullet' ? (
		<BulletSvg />
	) : checked ? (
		<SvgTickRound isAnnouncedByScreenReader size={styleSize} />
	) : (
		<SvgCrossRoundFilled isAnnouncedByScreenReader size={styleSize} />
	);
}

export function BenefitsCheckList({
	benefitsCheckListData,
	style = 'standard',
	iconColor = style === 'compact' ? palette.success[400] : palette.brand[500],
	cssOverrides,
	benefitsHeading,
}: BenefitsCheckListProps): JSX.Element {
	return (
		<ul css={[listCss(style), cssOverrides]}>
			{benefitsHeading && <p css={benefitHeadingCss}>{benefitsHeading}</p>}
			{benefitsCheckListData.map((item, index) => {
				const pillCopy = item.isNew ? 'New' : item.pill;
				return (
					<li
						key={index}
						css={css`
							display: flex;
						`}
					>
						{style !== 'hidden' && (
							<div
								css={[
									checkListIconCss(style),
									checkListIconColor(iconColor),
									item.maybeGreyedOut,
								]}
							>
								<div
									css={[
										style === 'standard' ? iconContainerCss : css``,
										item.hideBullet ? opaqueCss : css``,
									]}
								>
									<ChecklistItemIcon checked={item.isChecked} style={style} />
								</div>
							</div>
						)}
						<div css={[checkListTextCss, item.maybeGreyedOut]}>
							{typeof item.text === 'string' ? (
								<span css={checkListTextItemCss}>
									{pillCopy && <BenefitPill copy={pillCopy} />}{' '}
									{item.strong ? <strong>{item.text}</strong> : item.text}
									{item.toolTip && (
										<Tooltip
											children={<p>{item.toolTip}</p>}
											xAxisOffset={108}
											yAxisOffset={12}
											placement="bottom"
											desktopOnly={true}
										></Tooltip>
									)}
								</span>
							) : (
								item.text
							)}
						</div>
					</li>
				);
			})}
		</ul>
	);
}
