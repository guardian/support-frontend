import { css } from '@emotion/react';
import { border, from, space } from '@guardian/source-foundations';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import { DirectDebit } from 'helpers/forms/paymentMethods';
import type { Option } from 'helpers/types/option';
import DirectDebitTerms from './directDebitTerms';

const directDebitSection = css`
	display: block;
	padding: ${space[3]}px;
	padding-top: 0;
	background-color: #f6f6f6;
	border: none;

	${from.desktop} {
		border-top: 1px solid ${border.secondary};
	}
`;
const borderTop = css`
	display: block;
	border-top: 1px solid ${border.secondary};

	${from.desktop} {
		border-top: none;
	}
`;
export default function DirectDebitPaymentTerms(props: {
	paymentMethod: Option<PaymentMethod>;
}): JSX.Element | null {
	return props.paymentMethod === DirectDebit ? (
		<span css={directDebitSection}>
			<span css={borderTop}>
				<DirectDebitTerms />
			</span>
		</span>
	) : null;
}
