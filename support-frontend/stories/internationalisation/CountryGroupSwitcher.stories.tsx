import React from 'react';
import CountryGroupSwitcherComponent from 'components/countryGroupSwitcher/countryGroupSwitcher';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
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
	title: 'Internationalisation/Country Group Switcher',
	component: CountryGroupSwitcherComponent,
	argTypes: {
		countryGroup: {
			type: 'select',
			options: [
				AUDCountries,
				Canada,
				EURCountries,
				GBPCountries,
				International,
				NZDCountries,
				UnitedStates,
			],
		},
	},
	decorators: [
		(Story: React.FC): JSX.Element => (
			<div
				style={{
					width: '100%',
					padding: '16px',
					backgroundColor: '#04204B',
					color: '#ffffff',
				}}
			>
				<Story />
			</div>
		),
	],
};

export function CountryGroupSwitcher(args: {
	countryGroup: CountryGroupId;
}): JSX.Element {
	return (
		<CountryGroupSwitcherComponent
			countryGroupIds={[
				GBPCountries,
				UnitedStates,
				AUDCountries,
				EURCountries,
				NZDCountries,
				Canada,
				International,
			]}
			selectedCountryGroup={args.countryGroup}
			subPath={window.location.search}
		/>
	);
}

CountryGroupSwitcher.args = {
	countryGroup: GBPCountries,
};
