import '__mocks__/settingsMock';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { createTestStoreForContributions } from '__test-utils__/testStore';
import { setPaymentMethod } from 'helpers/redux/checkout/payment/paymentMethod/actions';
import {
	setEmail,
	setFirstName,
	setLastName,
} from 'helpers/redux/checkout/personalDetails/actions';
import { setProductType } from 'helpers/redux/checkout/product/actions';
import { setCountryInternationalisation } from 'helpers/redux/commonState/actions';
import { setStorybookUser } from 'helpers/redux/user/actions';
import { setUpRedux } from 'pages/supporter-plus-landing/setup/setUpRedux';
import { SupporterPlusLandingPage } from 'pages/supporter-plus-landing/supporterPlusLanding';

global.window.guardian = {
	...global.window.guardian,
	stripeKeyDefaultCurrencies: {
		ONE_OFF: { test: '', default: '' },
		REGULAR: { test: '', default: '' },
	},
};

const store = createTestStoreForContributions();
store.dispatch(setCountryInternationalisation('GBP'));

// This function has side effects such as retrieving the user email from session storage
setUpRedux(store);

// These overrides ensure the user will arrive at this story with a blank slate
store.dispatch(setStorybookUser(true));
store.dispatch(setProductType('MONTHLY'));
store.dispatch(setFirstName(''));
store.dispatch(setLastName(''));
store.dispatch(setEmail(''));
store.dispatch(setPaymentMethod({ paymentMethod: 'None' }));

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
