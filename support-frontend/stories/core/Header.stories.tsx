import Header from 'components/headers/header/header';
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

function Template(args: {
	display: 'navigation' | 'checkout' | 'guardianLogo';
	countryGroupId: CountryGroupId;
}): JSX.Element {
	return <Header display={args.display} countryGroupId={args.countryGroupId} />;
}

Template.args = {} as Record<string, unknown>;

export const Navigation = Template.bind({});

Navigation.args = {
	display: 'navigation',
	countryGroupId: GBPCountries,
};

export const Checkout = Template.bind({});

Checkout.args = {
	display: 'checkout',
	countryGroupId: GBPCountries,
};
