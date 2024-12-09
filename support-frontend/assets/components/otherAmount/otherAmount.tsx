import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
import { NumericInput } from '@guardian/source-development-kitchen/react-components';
import type { HTMLAttributes } from 'react';
import { currencies } from 'helpers/internationalisation/currency';
import type { IsoCurrency } from 'helpers/internationalisation/currency';

const topSpacing = css`
	margin-top: ${space[2]}px;
`;

export type OtherAmountProps = {
	selectedAmount: number | 'other';
	otherAmount: string;
	currency: IsoCurrency;
	minAmount: number;
	maxAmount: number;
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
	const currencyDetails = currencies[currency];
	const glyph = currencyDetails.isPaddedGlyph
		? ` ${currencyDetails.glyph} `
		: currencyDetails.glyph;

	const prefix = currencyDetails.isSuffixGlyph ? '' : glyph;
	const suffix = currencyDetails.isSuffixGlyph ? glyph : '';

	if (selectedAmount === 'other') {
		return (
			<div css={topSpacing}>
				<NumericInput
					id="otherAmount"
					label="Enter your amount"
					prefixText={prefix}
					suffixText={suffix}
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
