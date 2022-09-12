import type { ReactNode } from 'react';
import CountryGroupSwitcher from 'components/countryGroupSwitcher/countryGroupSwitcher';
import { CountrySwitcherContainer } from 'components/headers/simpleHeader/countrySwitcherContainer';
import { Header } from 'components/headers/simpleHeader/simpleHeader';
import {
	AUDCountries,
	Canada,
	EURCountries,
	GBPCountries,
	International,
	NZDCountries,
	UnitedStates,
} from 'helpers/internationalisation/countryGroup';

export default {
	title: 'Core/Simple Header',
	component: Header,
};

function Template(args: { children?: ReactNode }) {
	return <Header>{args.children}</Header>;
}

Template.args = {} as Record<string, unknown>;

export const Default = Template.bind({});

export const WithCountrySwitcher = Template.bind({});

WithCountrySwitcher.args = {
	children: (
		<CountrySwitcherContainer>
			<CountryGroupSwitcher
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
				subPath="/"
			/>
		</CountrySwitcherContainer>
	),
};
