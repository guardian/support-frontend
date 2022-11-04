import '__mocks__/settingsMock';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { createTestStoreForContributions } from '__test-utils__/testStore';
import { setCountryInternationalisation } from 'helpers/redux/commonState/actions';
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

formInit(store);

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
