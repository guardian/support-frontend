import { Provider } from 'react-redux';
import { detect } from 'helpers/internationalisation/countryGroup';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { initRedux } from 'helpers/page/page';
import { renderPage } from 'helpers/rendering/render';
import * as user from 'helpers/user/user';
import { initReducer } from '../contributions-landing/contributionsLandingReducer';
import { setUserStateActions } from '../contributions-landing/setUserStateActions';
import ContributionsCheckout from './ContributionsCheckout';
import { init as formInit } from './init';

// ---- Redux ---- //

const store = initRedux(() => initReducer(), true);
const countryGroupId: CountryGroupId = detect();
user.init(store.dispatch, setUserStateActions(countryGroupId));
formInit(store);

// ---- Component ---- //

function ContributionsCheckoutInEpic() {
	return (
		<Provider store={store}>
			<ContributionsCheckout />
		</Provider>
	);
}

// ---- Render ---- //

renderPage(<ContributionsCheckoutInEpic />, 'contributions-checkout-in-epic');
