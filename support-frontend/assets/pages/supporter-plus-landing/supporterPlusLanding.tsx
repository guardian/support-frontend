import { CheckoutHeading } from 'components/checkoutHeading/checkoutHeading';
import Nav from 'components/nav/nav';
import { PageScaffold } from 'components/page/pageScaffold';
import {
	AUDCountries,
	Canada,
	EURCountries,
	GBPCountries,
	International,
	NZDCountries,
	UnitedStates,
} from 'helpers/internationalisation/countryGroup';

export function SupporterPlusLandingPage(): JSX.Element {
	return (
		<PageScaffold id="supporter-plus-landing">
			<Nav
				countryGroupIds={[
					GBPCountries,
					UnitedStates,
					AUDCountries,
					EURCountries,
					NZDCountries,
					Canada,
					International,
				]}
				selectedCountryGroup={GBPCountries}
				subPath={window.location.search}
			/>
			<CheckoutHeading heading="Thank you for your support">
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
					ex justo, varius ut porttitor tristique, rhoncus quis dolor.
				</p>
			</CheckoutHeading>
		</PageScaffold>
	);
}
