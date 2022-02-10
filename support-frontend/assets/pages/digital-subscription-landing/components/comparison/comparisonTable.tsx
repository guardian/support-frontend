import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { from } from '@guardian/src-foundations/mq';
import { border } from '@guardian/src-foundations/palette';
import { body } from '@guardian/src-foundations/typography';
import React from 'react';
import type { ReactNode } from 'react';
import BlockLabel from 'components/blockLabel/blockLabel';
import { finalRow, tableContent, titleRow } from './tableContents';
import 'helpers/types/option';

export type TableRow = {
	icon: ReactNode | null;
	description: string | ReactNode;
	free: ReactNode | null;
	paid: ReactNode | null;
	cssOverrides?: string | string[];
};
const borderStyle = `${border.primary} 1px solid`;
const container = css`
	padding-top: ${space[4]}px;

	${from.desktop} {
		padding: 0;
	}
`;
const columnHeading = css`
	border-left: ${borderStyle};
	border-top: ${borderStyle};
`;
const columnHeadingLast = css`
	border-right: ${borderStyle};
`;
const table = css`
	width: 100%;
`;
const tableContainer = css`
	border: ${borderStyle};
	border-bottom: none;
`;
const label = css`
	position: absolute;
	left: 0;
	top: -27px;

	${from.tablet} {
		top: -31px;
	}

	${from.desktop} {
		top: -35px;
	}
`;
const rowStyle = css`
	border-bottom: ${borderStyle};
`;
const rowIconAndText = css`
	text-align: left;
	vertical-align: middle;
	padding-left: ${space[3]}px;

	${from.mobileMedium} {
		padding-right: ${space[3]}px;
	}
`;
const descriptionStyle = css`
	display: flex;
	align-items: center;
	${body.small()};

	${from.phablet} {
		${body.medium()};
	}
`;
const visuallyHidden = css`
	height: 1px;
	overflow: hidden;
	position: absolute;
	white-space: nowrap;
	width: 1px;
`;

function ComparisonTableRow({
	icon,
	description,
	free,
	paid,
	cssOverrides,
}: TableRow) {
	return (
		<tr css={[rowStyle, cssOverrides]}>
			<th scope="row" css={rowIconAndText}>
				<div css={descriptionStyle}>
					{icon}
					<span>{description}</span>
				</div>
			</th>
			<td>{free}</td>
			<td>{paid}</td>
		</tr>
	);
}

function ComparisonTable(): JSX.Element {
	return (
		<section css={container}>
			<BlockLabel tag="h2" cssOverrides={label}>
				Your subscription at a glance
			</BlockLabel>
			<table css={table}>
				<caption css={visuallyHidden}>
					What&apos;s included in a paid digital subscription
				</caption>
				<thead>
					<tr css={[rowStyle, titleRow.cssOverrides]}>
						<th scope="col" css={[rowIconAndText]}>
							<span css={visuallyHidden}>Benefits</span>
						</th>
						<th scope="col" css={columnHeading}>
							{titleRow.free}
						</th>
						<th scope="col" css={[columnHeading, columnHeadingLast]}>
							{titleRow.paid}
						</th>
					</tr>
				</thead>
				<tbody css={tableContainer}>
					{tableContent.map((row) => (
						<ComparisonTableRow
							cssOverrides={row.cssOverrides}
							icon={row.icon}
							description={row.description}
							free={row.free}
							paid={row.paid}
						/>
					))}
				</tbody>
				<tfoot>
					<tr css={[rowStyle]}>
						<td colSpan={3} css={[rowIconAndText, finalRow.cssOverrides]}>
							<div css={descriptionStyle}>
								{finalRow.icon}
								<span>{finalRow.description}</span>
							</div>
						</td>
					</tr>
				</tfoot>
			</table>
		</section>
	);
}

export default ComparisonTable;
