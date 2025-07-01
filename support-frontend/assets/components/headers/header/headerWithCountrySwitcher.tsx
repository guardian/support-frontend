// ----- Imports ----- //

import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import CountryGroupSwitcher from 'components/countryGroupSwitcher/countryGroupSwitcher';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import type { Option } from 'helpers/types/option';
import Header from './header';

// ------ Component ----- //

export default function ({
	path,
	countryGroupId,
	listOfCountryGroups,
	trackProduct,
}: {
	path: string;
	countryGroupId: CountryGroupId;
	listOfCountryGroups: CountryGroupId[];
	trackProduct?: Option<SubscriptionProduct>;
	hideDigiSub?: boolean;
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
			/>
		);
	};
}
