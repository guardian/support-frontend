import { Link } from '@guardian/source/react-components';

export default function LegitimateInterestMessage(): JSX.Element {
	return (
		<p>
			Your payment is being processed. Look out for your exclusive newsletter
			from our supporter editor, plus emails to help you manage and get the most
			out of your support. Adjust your email preferences at any time via{' '}
			<Link href="https://manage.theguardian.com/">your account</Link>.
		</p>
	);
}
