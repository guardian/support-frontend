import type { SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import { from, palette, space, textSans } from '@guardian/source/foundations';
import { SvgCrossRound, SvgTickRound } from '@guardian/source/react-components';
import Tooltip from 'components/tooltip/Tooltip';

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
	display: inline-block;

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
			vertical-align: middle;
		}
	}
	strong {
		font-weight: bold;
	}
`;
const tableCss = (style: CheckListStyle) => css`
	${style === 'standard'
		? textSans.medium({ lineHeight: 'tight' })
		: textSans.small()}

	padding-top: ${space[4]}px;

	& tr:not(:last-child) {
		border-bottom: 6px solid transparent;
	}

	${from.mobileLandscape} {
		& tr:not(:last-child) {
			border-bottom: ${space[3]}px solid transparent;
		}
	}
`;

export type CheckListData = {
	isChecked: boolean;
	text?: JSX.Element | string;
	maybeGreyedOut?: SerializedStyles;
	toolTip?: string;
	strong?: boolean;
};

type CheckListStyle = 'standard' | 'compact';

export type CheckListProps = {
	checkListData: CheckListData[];
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
	return checked ? (
		<SvgTickRound
			isAnnouncedByScreenReader
			size={style === 'standard' ? 'small' : 'xsmall'}
		/>
	) : (
		<SvgCrossRound
			isAnnouncedByScreenReader
			size={style === 'standard' ? 'small' : 'xsmall'}
		/>
	);
}

export function CheckList({
	checkListData,
	style = 'standard',
	iconColor = style === 'compact' ? palette.success[400] : palette.brand[500],
	cssOverrides,
}: CheckListProps): JSX.Element {
	return (
		<table css={[tableCss(style), cssOverrides]}>
			{checkListData.map((item) => (
				<tr>
					<td
						css={[
							checkListIconCss(style),
							checkListIconColor(iconColor),
							item.maybeGreyedOut,
						]}
					>
						<div css={style === 'standard' ? iconContainerCss : css``}>
							<ChecklistItemIcon checked={item.isChecked} style={style} />
						</div>
					</td>
					<td css={[checkListTextCss, item.maybeGreyedOut]}>
						{typeof item.text === 'string' ? (
							<span css={checkListTextItemCss}>
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
					</td>
				</tr>
			))}
		</table>
	);
}
