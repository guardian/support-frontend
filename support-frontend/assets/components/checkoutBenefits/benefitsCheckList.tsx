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
import BulletSvg from './bulletSvg';
import { NewBenefitPill } from './newBenefitPill';

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

const checkListTextItemCss = css`
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

export type BenefitsCheckListData = {
	isChecked: boolean;
	text?: JSX.Element | string;
	maybeGreyedOut?: SerializedStyles;
	toolTip?: string;
	strong?: boolean;
	isNew?: boolean;
	hideBullet?: boolean;
};

type CheckListStyle = 'standard' | 'compact' | 'hidden' | 'bullet';

export type BenefitsCheckListProps = {
	benefitsCheckListData: BenefitsCheckListData[];
	style?: CheckListStyle;
	iconColor?: string;
	cssOverrides?: SerializedStyles;
};

function ChecklistItemIcon({
	checked,
	style,
	hideBullet,
}: {
	checked: boolean;
	style: CheckListStyle;
	hideBullet?: boolean;
}): JSX.Element {
	const styleSize = style === 'standard' ? 'small' : 'xsmall';
	return style === 'bullet' ? (
		<BulletSvg opacity={hideBullet ? 0 : 1} />
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
}: BenefitsCheckListProps): JSX.Element {
	return (
		<ul css={[listCss(style), cssOverrides]}>
			{benefitsCheckListData.map((item) => (
				<li
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
							<div css={style === 'standard' ? iconContainerCss : css``}>
								<ChecklistItemIcon
									checked={item.isChecked}
									style={style}
									hideBullet={item.hideBullet}
								/>
							</div>
						</div>
					)}
					<div css={[checkListTextCss, item.maybeGreyedOut]}>
						{typeof item.text === 'string' ? (
							<span css={checkListTextItemCss}>
								{item.isNew && (
									<>
										<NewBenefitPill />{' '}
									</>
								)}
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
			))}
		</ul>
	);
}
