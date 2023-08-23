import type { SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import { from, palette, space, textSans } from '@guardian/source-foundations';
import { SvgCrossRound, SvgTickRound } from '@guardian/source-react-components';

const checkListIconCss = (style: CheckmarkListStyle) => css`
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

const tableCss = (style: CheckmarkListStyle) => css`
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
	text?: JSX.Element;
	maybeGreyedOut?: SerializedStyles;
};

type CheckmarkListStyle = 'standard' | 'compact';

export type CheckmarkListProps = {
	checkListData: CheckListData[];
	style?: CheckmarkListStyle;
	iconColor?: string;
};

function ChecklistItemIcon({
	checked,
	style,
}: {
	checked: boolean;
	style: CheckmarkListStyle;
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

export function CheckmarkList({
	checkListData,
	style = 'standard',
	iconColor = style === 'compact' ? palette.success[400] : palette.brand[500],
}: CheckmarkListProps): JSX.Element {
	return (
		<table css={tableCss(style)}>
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
					<td css={[checkListTextCss, item.maybeGreyedOut]}>{item.text}</td>
				</tr>
			))}
		</table>
	);
}
