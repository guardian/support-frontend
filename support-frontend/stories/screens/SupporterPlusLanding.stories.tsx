import '__mocks__/settingsMock';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { createTestStoreForContributions } from '__test-utils__/testStore';
import { setPaymentMethod } from 'helpers/redux/checkout/payment/paymentMethod/actions';
import { setProductType } from 'helpers/redux/checkout/product/actions';
import { setCountryInternationalisation } from 'helpers/redux/commonState/actions';
import { defaultUserActionFunctions } from 'helpers/user/defaultUserActionFunctions';
import {
	setEmail,
	setFirstName,
	setLastName,
} from 'pages/contributions-landing/contributionsLandingActions';
import { init as formInit } from 'pages/contributions-landing/contributionsLandingInit';
import { SupporterPlusLandingPage } from 'pages/supporter-plus-landing/supporterPlusLanding';

global.window.guardian = {
	...global.window.guardian,
	stripeKeyDefaultCurrencies: {
		ONE_OFF: { uat: '', default: '' },
		REGULAR: { uat: '', default: '' },
	},
};

const store = createTestStoreForContributions();
store.dispatch(setCountryInternationalisation('GBP'));

// This function has side effects such as retrieving the user email from session storage
formInit(store);

// These overrides ensure the user will arrive at this story with a blank slate
store.dispatch(defaultUserActionFunctions.setStorybookUser(true));
store.dispatch(setProductType('MONTHLY'));
store.dispatch(setFirstName(''));
store.dispatch(setLastName(''));
store.dispatch(setEmail(''));
store.dispatch(setPaymentMethod('None'));

export default {
	component: SupporterPlusLandingPage,
	title: 'Screens/Supporter Plus Landing Page',
	decorators: [
		(Story: React.FC): JSX.Element => (
			<Provider store={store}>
				<MemoryRouter>
					<Routes>
						<Route path="/*" element={<Story />} />
					</Routes>
				</MemoryRouter>
			</Provider>
		),
	],
};

function Template() {
	return <SupporterPlusLandingPage thankYouRoute={'/uk/thankyou'} />;
}

export const Default = Template.bind({});
