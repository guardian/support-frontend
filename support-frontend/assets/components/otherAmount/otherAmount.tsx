import { css } from '@emotion/react';
import { space } from '@guardian/source-foundations';
import { NumericInput } from '@guardian/source-react-components-development-kitchen';
import { currencies } from 'helpers/internationalisation/currency';
import type { IsoCurrency } from 'helpers/internationalisation/currency';

const topSpacing = css`
	margin-top: ${space[2]}px;
`;

export type OtherAmountProps = {
	selectedAmount: string;
	otherAmount: string;
	currency: IsoCurrency;
	minAmount: number;
	onOtherAmountChange: (newAmount: string) => void;
	errors?: string[];
};

export function OtherAmount({
	selectedAmount,
	otherAmount,
	currency,
	onOtherAmountChange,
	errors,
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
					value={otherAmount}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						onOtherAmountChange(e.target.value)
					}
				/>
			</div>
		);
	}
	return null;
}
