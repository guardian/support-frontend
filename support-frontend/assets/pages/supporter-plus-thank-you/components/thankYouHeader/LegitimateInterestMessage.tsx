import { css } from '@emotion/react';
import { Link } from '@guardian/source/react-components';

const legitimateInterestStyle = css`
	a {
		font-weight: bold;
	}
`;

export default function LegitimateInterestMessage({
	showPaymentStatus,
}: {
	showPaymentStatus: boolean;
}): JSX.Element {
	const status = 'Your payment is being processed. ';
	return (
		<p css={legitimateInterestStyle}>
			{showPaymentStatus && status}Look out for your exclusive newsletter from
			our supporter editor, plus emails to help you manage and get the most out
			of your support. Adjust your email preferences at any time via{' '}
			<Link href="https://manage.theguardian.com/">your account</Link>.
		</p>
	);
}
