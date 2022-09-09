import '__mocks__/settingsMock';
import { Provider } from 'react-redux';
import { createTestStoreForContributions } from '__test-utils__/testStore';
import { SupporterPlusLandingPage } from 'pages/supporter-plus-landing/supporterPlusLanding';

const store = createTestStoreForContributions();

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
