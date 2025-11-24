import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import {
	AUDCountries,
	Canada,
	EURCountries,
	GBPCountries,
	International,
	NZDCountries,
	UnitedStates,
} from '@modules/internationalisation/countryGroup';
import Header from 'components/headers/header/header';

export default {
	title: 'Core/Header',
	component: Header,
	argTypes: {
		display: {
			control: {
				type: 'radio',
				options: ['navigation', 'checkout', 'guardianLogo'],
			},
		},
		countryGroupId: {
			control: {
				type: 'select',
				options: [
					GBPCountries,
					UnitedStates,
					AUDCountries,
					EURCountries,
					NZDCountries,
					Canada,
					International,
				],
			},
		},
	},
};

function Template(args: { countryGroupId: CountryGroupId }): JSX.Element {
	return <Header countryGroupId={args.countryGroupId} />;
}

Template.args = {} as Record<string, unknown>;

export const Navigation = Template.bind({});

Navigation.args = {
	countryGroupId: GBPCountries,
};
