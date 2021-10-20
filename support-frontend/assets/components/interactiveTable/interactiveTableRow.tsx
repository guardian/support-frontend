// @ts-expect-error
import { css } from '@emotion/core';
import { Button } from '@guardian/src-button';
import { space, transitions } from '@guardian/src-foundations';
import { visuallyHidden as _visuallyHidden } from '@guardian/src-foundations/accessibility';
import { from } from '@guardian/src-foundations/mq';
import {
	border,
	brandAltBackground,
	neutral,
	sport,
} from '@guardian/src-foundations/palette';
import { textSans } from '@guardian/src-foundations/typography';
import { SvgChevronDownSingle } from '@guardian/src-icons';
import React, { useState } from 'react';
import type { Node } from 'react';

const borderStyle = `${border.secondary} 1px solid`;
const visuallyHidden = css`
	${_visuallyHidden}
`;
const tableRow = css`
	position: relative;
	width: 100%;
	display: -ms-grid;
	display: grid;
	grid-template-columns: 1fr 40px 40px 42px;
	-ms-grid-rows: 72px 1fr;
	grid-template-rows: 72px 1fr;
	text-align: left;
	background-color: ${neutral[100]};
	max-height: 72px;
	overflow: hidden;
	will-change: max-height;
	transition: all ${transitions.medium};

	:not(:first-of-type) {
		margin-top: ${space[2]}px;
	}

	${from.desktop} {
		-ms-grid-columns: 1fr 72px 72px 60px;
		grid-template-columns: 1fr 72px 72px 60px;
	}
`;
const tableContentRow = css`
	:hover {
		background-color: ${sport[800]};
	}
`;
const tableHeaderRow = css`
	background-color: transparent;
	color: ${neutral[100]};
	-ms-grid-rows: 1fr;
	grid-template-rows: 1fr;
`;
const tableRowOpen = css`
	max-height: 800px;
`;
const tableCell = css`
	display: flex;
	flex: 0 1 auto;
	justify-content: center;
	align-items: center;
	max-height: 72px;
	padding: ${space[4]}px 0;
	padding-right: ${space[3]}px;
`;
const headingCell = css`
	-ms-grid-row-align: end;
	align-self: end;
	${textSans.small({
		fontWeight: 'bold',
	})}
	padding-bottom: 0;
	height: unset;
`;
const primaryTableCell = css`
	-ms-grid-column: 1;
	justify-content: flex-start;
	padding-left: ${space[3]}px;

	${from.desktop} {
		padding-left: 80px;
	}
`;
const iconCell = css`
	-ms-grid-column: 3;
	max-width: 48px;
`;
const expandableButtonCell = css`
	-ms-grid-column: 4;
	max-height: 72px;
	display: flex;
	align-items: center;
	border-left: ${borderStyle};
	padding: 5px;
	background-color: ${sport[800]};
`;
const detailsCell = css`
	max-height: 800px;
	min-height: 72px;
	-ms-grid-column: 1;
	-ms-grid-column-span: 4;
	-ms-grid-row: 2;
	grid-column: 1 / span 4;
	background-color: ${sport[800]};
	border-top: ${borderStyle};
	padding-left: ${space[3]}px;

	${from.desktop} {
		padding-left: 80px;
		padding-right: ${space[9]}px;
	}
`;
const detailsHidden = css`
	display: none;
`;
const detailsVisible = css`
	display: block;
`;
const toggleButton = css`
	position: absolute;
	/* Allows space for the 5px focus box shadow */
	top: 5px;
	left: 5px;
	right: 5px;
	width: calc(100% - 10px);
	height: 62px;
	align-items: center;
	justify-content: flex-end;
	overflow: hidden;
	padding-right: ${space[1]}px;

	${from.tablet} {
		padding-right: 14px;
	}

	span {
		overflow: hidden;
	}

	svg {
		fill: currentColor;
		height: ${space[4]}px;
		max-width: ${space[5]}px;
		transition: transform ${transitions.short};
	}
`;
const toggleButtonOpen = css`
	svg {
		transform: rotate(180deg);
	}
`;
const finalRow = css`
	display: block;
	margin-top: ${space[2]}px;
`;
const yellowBackground = css`
	background: ${brandAltBackground.primary};
`;
export type CellData = {
	content: Node;
	isPrimary?: boolean;
	isIcon?: boolean;
	isHidden?: boolean;
	isStyleless?: boolean;
};
export type RowData = {
	rowId: string;
	columns: CellData[];
	details: Node;
	onClick?: (showDetails: boolean) => void;
};
export function InteractiveTableHeaderRow({
	columns,
}: {
	columns: CellData[];
}) {
	return (
		<tr role="row" css={[tableRow, tableHeaderRow]}>
			{columns.map((col, index) => (
				<th
					scope="col"
					role="columnHeader"
					css={
						col.isStyleless
							? ''
							: [
									tableCell,
									headingCell,
									...(col.isIcon
										? [
												iconCell,
												css`
													-ms-grid-column: ${index + 1};
												`,
										  ]
										: ['']),
							  ]
					}
				>
					<span css={col.isHidden ? visuallyHidden : ''}>{col.content}</span>
				</th>
			))}
		</tr>
	);
}
export function InteractiveTableFooterRow({ children }: { children: Node }) {
	return (
		<tr role="row" css={[finalRow, yellowBackground]}>
			<td
				role="cell"
				colSpan="5"
				aria-colspan="5"
				css={[tableCell, primaryTableCell]}
			>
				{children}
			</td>
		</tr>
	);
}
export function InteractiveTableRow({
	rowId,
	columns,
	details,
	onClick = () => undefined,
}: RowData) {
	const [showDetails, setShowDetails] = useState<boolean>(false);

	function onRowClick() {
		onClick(!showDetails);
		setShowDetails(!showDetails);
	}

	return (
		<tr
			role="row"
			css={[tableRow, tableContentRow, showDetails ? tableRowOpen : '']}
		>
			{columns.map((column, index) => {
				if (column.isPrimary) {
					return (
						<th
							scope="row"
							role="rowHeader"
							css={[tableCell, primaryTableCell]}
						>
							{column.content}
						</th>
					);
				}

				return (
					<td
						role="cell"
						css={[
							tableCell,
							iconCell,
							css`
								-ms-grid-column: ${index + 1};
							`,
						]}
					>
						{column.content}
					</td>
				);
			})}
			<td role="cell" css={expandableButtonCell}>
				<Button
					hideLabel
					priority="subdued"
					icon={<SvgChevronDownSingle />}
					css={[toggleButton, showDetails ? toggleButtonOpen : '']}
					aria-expanded={showDetails ? 'true' : 'false'}
					aria-controls={`${rowId}-details`}
					onClick={onRowClick}
				>
					{`${showDetails ? 'Hide' : 'Show'} more details`}
				</Button>
			</td>
			<td
				role="cell"
				hidden={!showDetails}
				id={`${rowId}-details`}
				css={[
					tableCell,
					detailsCell,
					showDetails ? detailsVisible : detailsHidden,
				]}
			>
				{details}
			</td>
		</tr>
	);
}
InteractiveTableRow.defaultProps = {
	onClick: () => undefined,
};
