import { css } from '@emotion/react';
import { textSans } from '@guardian/source-foundations';
import { FormSection } from 'components/checkoutForm/checkoutForm';
import DirectDebitTerms from 'components/subscriptionCheckouts/directDebit/directDebitTerms';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import { DirectDebit } from 'helpers/forms/paymentMethods';
import type { Option } from 'helpers/types/option';

const threeTierTerms = css`
	${textSans.xxsmall()};
	color: #606060;
	p {
		margin-top: 10px;
	}
`;

export default function ThreeTierTerms(props: {
	paymentMethod: Option<PaymentMethod>;
	total: number;
	currencySymbol: string;
	paymentFrequency: 'month' | 'year';
	discount?: {
		total: number;
		duration: number;
		period: 'month' | 'year';
	};
}): JSX.Element {
	const price = props.discount?.total ?? props.total;
	return (
		<>
			<FormSection>
				<div css={threeTierTerms}>
					{props.paymentFrequency === 'month' && (
						<p>
							We will attempt to take payment of {props.currencySymbol}
							{price}, on the XXth day of every {props.paymentFrequency},&nbsp;
							{props.discount && `then ${props.currencySymbol}${props.total} `}
							from now until you cancel your payment. Payments may take up to 6
							days to be recorded in your bank account. You can change how much
							you give or cancel your payment at any time.
						</p>
					)}
					{props.paymentFrequency === 'year' && (
						<p>
							We will attempt to take payment of {props.currencySymbol}
							{price}, on the XXth day of every {props.paymentFrequency},&nbsp;
							{props.discount && `then ${props.currencySymbol}${props.total} `}
							from now until you cancel your payment. Payments may take up to 6
							days to be recorded in your bank account. You can change how much
							you give or cancel your payment at any time.
						</p>
					)}
					<p>
						By proceeding, you are agreeing to our All access digital Terms and
						conditions as well as our Guardian Weekly Terms and conditions.
					</p>
					<p>
						To find out what personal data we collect and how we use it, please
						visit our Privacy Policy.
					</p>
				</div>
			</FormSection>
			{props.paymentMethod === DirectDebit && (
				<FormSection>
					<DirectDebitTerms isThreeTier />
				</FormSection>
			)}
		</>
	);
}
