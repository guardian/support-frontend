import { css } from '@emotion/react';
import {
	from,
	neutral,
	space,
	textSansBold17,
} from '@guardian/source/foundations';
import { Checkbox } from '@guardian/source/react-components';
import { useState } from 'react';
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
	padding: 6px ${space[4]}px;
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

type CoverTransactionCostProps = {
	transactionCost: boolean;
	transactionCostAmount: string;
	transactionCostTotal: string;
	onChecked: (check: boolean) => void;
	showTransactionCostSummary?: boolean;
};

export function CoverTransactionCost({
	transactionCost,
	transactionCostAmount,
	transactionCostTotal,
	showTransactionCostSummary,
	onChecked,
}: CoverTransactionCostProps): JSX.Element {
	const [displayTransactionCostSummary, setDisplayTransactionCostSummary] =
		useState<boolean>(false);
	const transactionCostCopy = `I’d like to add a further ${transactionCostAmount} to cover the cost of this transaction, so that all of my support goes to powering independent, high quality journalism.`;
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
						<div>{transactionCostTotal}</div>
					</div>
				</div>
			)}
		</>
	);
}
