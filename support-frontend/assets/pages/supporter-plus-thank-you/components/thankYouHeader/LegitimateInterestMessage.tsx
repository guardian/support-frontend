import { Link } from '@guardian/source/react-components';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { messageBold } from './MessageStyles';
import { isGuardianWeeklyDigitalProduct } from './utils/productMatchers';

export default function LegitimateInterestMessage({
	productKey,
	ratePlanKey,
	showPaymentStatus,
}: {
	showPaymentStatus: boolean;
	productKey: ActiveProductKey;
	ratePlanKey: ActiveRatePlanKey;
}): JSX.Element {
	const status = 'Your payment is being processed. ';
	const isWeeklyDigital = isGuardianWeeklyDigitalProduct(
		productKey,
		ratePlanKey,
	);
	return (
		<p>
			{showPaymentStatus && status}Look out for your exclusive newsletter from
			our supporter editor, plus emails to help you manage and get the most out
			of your {isWeeklyDigital ? 'subscription' : 'support'}. Adjust your email
			preferences at any time via{' '}
			<Link href="https://manage.theguardian.com/" cssOverrides={messageBold}>
				your account
			</Link>
			.
		</p>
	);
}
