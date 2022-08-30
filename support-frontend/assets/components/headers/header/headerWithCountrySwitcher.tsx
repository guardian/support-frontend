// ----- Imports ----- //

import CountryGroupSwitcher from 'components/countryGroupSwitcher/countryGroupSwitcher';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import type { Option } from 'helpers/types/option';
import Header from './header';

// ------ Component ----- //

export default function ({
	path,
	countryGroupId,
	listOfCountryGroups,
	trackProduct,
	hideDigitalSupport: hideDigitalSupport,
}: {
	path: string;
	countryGroupId: CountryGroupId;
	listOfCountryGroups: CountryGroupId[];
	trackProduct?: Option<SubscriptionProduct>;
	hideDigitalSupport?: boolean;
}) {
	return function (): JSX.Element {
		return (
			<Header
				countryGroupId={countryGroupId}
				utility={
					<CountryGroupSwitcher
						countryGroupIds={listOfCountryGroups}
						selectedCountryGroup={countryGroupId}
						subPath={path}
						trackProduct={trackProduct}
					/>
				}
				hideDigitalSupport={hideDigitalSupport}
			/>
		);
	};
}
