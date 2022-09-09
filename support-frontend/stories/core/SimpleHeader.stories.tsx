import type { ReactNode } from 'react';
import { Header } from 'components/headers/simpleHeader/simpleHeader';

export default {
	title: 'Core/Simple Header',
	component: Header,
	// argTypes: {
	// 	display: {
	// 		control: {
	// 			type: 'radio',
	// 			options: ['navigation', 'checkout', 'guardianLogo'],
	// 		},
	// 	},
	// 	countryGroupId: {
	// 		control: {
	// 			type: 'select',
	// 			options: [
	// 				GBPCountries,
	// 				UnitedStates,
	// 				AUDCountries,
	// 				EURCountries,
	// 				NZDCountries,
	// 				Canada,
	// 				International,
	// 			],
	// 		},
	// 	},
	// },
};

function Template(args: { children?: ReactNode }) {
	return <Header>{args.children}</Header>;
}

export const Default = Template.bind({});
