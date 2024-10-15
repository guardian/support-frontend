import { css } from '@emotion/react';
import {
	from,
	neutral,
	space,
	textSansBold17,
} from '@guardian/source/foundations';
import { useState } from 'react';
import { Checkbox } from 'components/checkbox/Checkbox';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import { CheckoutDivider } from 'pages/supporter-plus-landing/components/checkoutDivider';

const coverTransactionDivider = css`
	hr {
		margin: ${space[4]}px 0px ${space[3]}px;
		${from.tablet} {
			margin: ${space[5]}px 0px ${space[3]}px;
		}
	}
`;

const coverTransactionCheckboxContainer = css`
	padding: ${space[4]}px;
	background-color: ${neutral[97]};
	border-radius: 12px;
	margin: ${space[4]}px 0px ${space[2]}px;
	${from.tablet} {
		margin-top: ${space[5]}px 0px 0px;
	}
	> div > input {
		background-color: ${neutral[100]};
	}
`;

const coverTransactionSummaryContainer = css`
	${textSansBold17};
	display: flex;
	justify-content: space-between;
	padding: 0px 0px ${space[2]}px;
`;

export type CoverTransactionCostProps = {
	transactionCost: boolean;
	transactionCostCopy: string;
	transactionCostAmount: string;
	onChecked: (check: boolean) => void;
	showTransactionCostSummary?: boolean;
};

export function CoverTransactionCost({
	transactionCost,
	transactionCostCopy,
	transactionCostAmount,
	showTransactionCostSummary,
	onChecked,
}: CoverTransactionCostProps): JSX.Element {
	const [displayTransactionCostSummary, setDisplayTransactionCostSummary] =
		useState<boolean>(false);

	return (
		<>
			<div css={coverTransactionCheckboxContainer}>
				<Checkbox
					checked={transactionCost}
					onChange={(e) => {
						if (e.target.checked) {
							sendTrackingEventsOnClick({
								id: 'cover-transaction-cost-checkbox',
								componentType: 'ACQUISITIONS_BUTTON',
							})();
						}
						onChecked(e.target.checked);
						if (showTransactionCostSummary) {
							setDisplayTransactionCostSummary(true);
						}
					}}
					label={transactionCostCopy}
				/>
			</div>
			{displayTransactionCostSummary && (
				<div css={coverTransactionDivider}>
					<CheckoutDivider spacing="tight" />
					<div css={coverTransactionSummaryContainer}>
						Total amount
						<div>{transactionCostAmount}</div>
					</div>
				</div>
			)}
		</>
	);
}
