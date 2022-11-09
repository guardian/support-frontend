import '__mocks__/settingsMock';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { createTestStoreForContributions } from '__test-utils__/testStore';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { countryGroups } from 'helpers/internationalisation/countryGroup';
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
	argTypes: {
		countryGroup: {
			options: (Object.keys(countryGroups) as CountryGroupId[]).filter(
				(countryGroup) => countryGroup !== 'AUDCountries',
			),
			control: { type: 'radio' },
			if: { arg: 'countryGroup', exists: true },
		},
	},
};

function Template() {
	return <SupporterPlusLandingPage thankYouRoute={'/uk/thankyou'} />;
}

Template.args = {} as Record<string, unknown>;
Template.decorators = [] as unknown[];

export const Default = Template.bind({});

Default.args = {
	countryGroup: 'GBPCountries',
};

Default.decorators = [
	(
		Story: React.FC,
		{ args }: Record<string, { countryGroup: CountryGroupId }>,
	): JSX.Element => {
		const { countryGroup } = args;

		const store = createTestStoreForContributions();

		store.dispatch(
			setCountryInternationalisation(countryGroups[countryGroup].countries[0]),
		);

		return (
			<Provider store={store}>
				<MemoryRouter>
					<Routes>
						<Route path="/*" element={<Story />} />
					</Routes>
				</MemoryRouter>
			</Provider>
		);
	},
];
