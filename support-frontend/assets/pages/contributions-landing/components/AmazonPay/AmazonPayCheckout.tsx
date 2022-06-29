import type { ContributionType } from 'helpers/contributions';
import type {
	AmazonLoginObject,
	AmazonPayData,
	AmazonPaymentsObject,
} from 'helpers/forms/paymentIntegrations/amazonPay/types';
import AmazonPayLoginButton from './AmazonPayLoginButton';
import AmazonPayWallet from './AmazonPayWallet';

interface AmazonPayProps {
	loginObject?: AmazonLoginObject;
	paymentsObject?: AmazonPaymentsObject;
	amazonPayData: AmazonPayData;
	isTestUser: boolean;
	contributionType: ContributionType;
}

export function AmazonPayCheckout({
	loginObject,
	paymentsObject,
	amazonPayData,
	isTestUser,
	contributionType,
}: AmazonPayProps): JSX.Element {
	return amazonPayData.hasAccessToken ? (
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
