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
const tableCss = (style: CheckListStyle) => css`
	${style === 'standard' ? { textSans17, lineHeight: 'tight' } : { textSans15 }}

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

export type BenefitsCheckListData = {
	isChecked: boolean;
	text?: JSX.Element | string;
	maybeGreyedOut?: SerializedStyles;
	toolTip?: string;
	strong?: boolean;
	isNew?: boolean;
};

type CheckListStyle = 'standard' | 'compact' | 'hidden';

export type BenefitsCheckListProps = {
	benefitsCheckListData: BenefitsCheckListData[];
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
		<SvgCrossRoundFilled
			isAnnouncedByScreenReader
			size={style === 'standard' ? 'small' : 'xsmall'}
		/>
	);
}

export function BenefitsCheckList({
	benefitsCheckListData,
	style = 'standard',
	iconColor = style === 'compact' ? palette.success[400] : palette.brand[500],
	cssOverrides,
}: BenefitsCheckListProps): JSX.Element {
	return (
		<table css={[tableCss(style), cssOverrides]}>
			{benefitsCheckListData.map((item) => (
				<tr>
					{style !== 'hidden' && (
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
					)}
					<td css={[checkListTextCss, item.maybeGreyedOut]}>
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
					</td>
				</tr>
			))}
		</table>
	);
}
