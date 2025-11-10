import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
import { NumericInput } from '@guardian/source-development-kitchen/react-components';
import type { IsoCurrency } from '@modules/internationalisation/currency';
import { getCurrencyInfo } from '@modules/internationalisation/currency';
import type { HTMLAttributes } from 'react';

const topSpacing = css`
	margin-top: ${space[2]}px;
`;

export type OtherAmountProps = {
	selectedAmount: number | 'other';
	otherAmount: string;
	currency: IsoCurrency;
	minAmount?: number;
	maxAmount?: number;
	onOtherAmountChange: (newAmount: string) => void;
	errors?: string[];
} & HTMLAttributes<HTMLInputElement>;

export function OtherAmount({
	selectedAmount,
	otherAmount,
	currency,
	onOtherAmountChange,
	onBlur,
	onInvalid,
	errors,
	minAmount,
	maxAmount,
}: OtherAmountProps): JSX.Element | null {
	const currencyDetails = getCurrencyInfo(currency);

	if (selectedAmount === 'other') {
		return (
			<div css={topSpacing}>
				<NumericInput
					id="otherAmount"
					label="Enter your amount"
					prefixText={currencyDetails.glyph}
					error={errors?.[0]}
					value={otherAmount === '0' ? '' : otherAmount}
					type="number"
					onBlur={onBlur}
					min={minAmount}
					max={maxAmount}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						onOtherAmountChange(e.target.value)
					}
					onInvalid={onInvalid}
				/>
			</div>
		);
	}
	return null;
}
