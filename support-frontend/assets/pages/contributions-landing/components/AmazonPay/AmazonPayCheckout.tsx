import type { ContributionType } from 'helpers/contributions';
import type {
	AmazonLoginObject,
	AmazonPaymentsObject,
} from 'helpers/forms/paymentIntegrations/amazonPay/types';
import AmazonPayLoginButton from './AmazonPayLoginButton';
import AmazonPayWallet from './AmazonPayWallet';

interface AmazonPayCheckoutProps {
	loginObject?: AmazonLoginObject;
	paymentsObject?: AmazonPaymentsObject;
	hasAccessToken: boolean;
	isTestUser: boolean;
	contributionType: ContributionType;
}

export function AmazonPayCheckout({
	loginObject,
	paymentsObject,
	hasAccessToken,
	isTestUser,
	contributionType,
}: AmazonPayCheckoutProps): JSX.Element {
	return hasAccessToken ? (
		<AmazonPayWallet
			amazonLoginObject={loginObject}
			amazonPaymentsObject={paymentsObject}
			isTestUser={isTestUser}
			contributionType={contributionType}
		/>
	) : (
		<AmazonPayLoginButton
			amazonLoginObject={loginObject}
			amazonPaymentsObject={paymentsObject}
		/>
	);
}
