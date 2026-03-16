import { Link } from '@guardian/source/react-components';
import { messageBold } from './MessageStyles';

export default function LegitimateInterestMessage({
	showPaymentStatus,
	enableWeeklyDigital,
}: {
	showPaymentStatus: boolean;
	enableWeeklyDigital?: boolean;
}): JSX.Element {
	const status = 'Your payment is being processed. ';
	return (
		<p>
			{showPaymentStatus && status}Look out for your exclusive newsletter from
			our supporter editor, plus emails to help you manage and get the most out
			of your {enableWeeklyDigital ? 'subscription' : 'support'}. Adjust your
			email preferences at any time via{' '}
			<Link href="https://manage.theguardian.com/" cssOverrides={messageBold}>
				your account
			</Link>
			.
		</p>
	);
}
