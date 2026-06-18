import { sendTrackingEventsOnClick } from '../../../helpers/productPrice/subscriptions';
import { getManageSubsUrl } from '../../../helpers/urls/externalLinks';

export const ManageMyAccountLink = (
	<a
		href={getManageSubsUrl()}
		onClick={sendTrackingEventsOnClick({
			id: 'checkout_my_account',
			product: 'PremiumTier',
			componentType: 'ACQUISITIONS_BUTTON',
		})}
	>
		Manage My Account
	</a>
);
