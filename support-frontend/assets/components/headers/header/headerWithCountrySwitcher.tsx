// ----- Imports ----- //
import CountryGroupSwitcher from 'components/countryGroupSwitcher/countryGroupSwitcher';
import type { Option } from 'helpers/types/option';
import 'helpers/types/option';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import 'helpers/internationalisation/countryGroup';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import 'helpers/productPrice/subscriptions';
import Header from './header'; // ------ Component ----- //

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
}) {
	return () => (
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
}
