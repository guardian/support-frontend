import '__mocks__/settingsMock';
import { Provider } from 'react-redux';
import { createTestStoreForContributions } from '__test-utils__/testStore';
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

formInit(store);

export default {
	component: SupporterPlusLandingPage,
	title: 'Screens/Supporter Plus Landing Page',
	decorators: [
		(Story: React.FC): JSX.Element => (
			<Provider store={store}>
				<Story />
			</Provider>
		),
	],
};

function Template() {
	return <SupporterPlusLandingPage />;
}

export const Default = Template.bind({});
