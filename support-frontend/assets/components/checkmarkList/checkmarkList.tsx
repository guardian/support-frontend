import type { SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import { from, palette, space } from '@guardian/source-foundations';
import { SvgCrossRound, SvgTickRound } from '@guardian/source-react-components';

const checkListIconCss = css`
	vertical-align: top;
	padding-right: 10px;
	line-height: 0;

	svg {
		fill: ${palette.brand[500]};
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

const tableCss = css`
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

export type CheckmarkListProps = {
	checkListData: CheckListData[];
};

function ChecklistItemIcon({ checked }: { checked: boolean }): JSX.Element {
	return checked ? (
		<SvgTickRound isAnnouncedByScreenReader size="small" />
	) : (
		<SvgCrossRound isAnnouncedByScreenReader size="small" />
	);
}

export function CheckmarkList({
	checkListData,
}: CheckmarkListProps): JSX.Element {
	return (
		<table css={tableCss}>
			{checkListData.map((item) => (
				<tr>
					<td css={[checkListIconCss, item.maybeGreyedOut]}>
						<div css={iconContainerCss}>
							<ChecklistItemIcon checked={item.isChecked} />
						</div>
					</td>
					<td css={[checkListTextCss, item.maybeGreyedOut]}>{item.text}</td>
				</tr>
			))}
		</table>
	);
}
