import type { ReactNode } from 'react';
import { CountrySwitcherContainer } from 'components/headers/simpleHeader/countrySwitcherContainer';
import { Header } from 'components/headers/simpleHeader/simpleHeader';
import SupportRegionSwitcher from '../../assets/components/supportRegionSwitcher/supportRegionSwitcher';

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
			<SupportRegionSwitcher
				supportRegionIds={['uk', 'us', 'au', 'eu', 'nz', 'ca', 'int']}
				selectedSupportRegion={'uk'}
				subPath="/"
			/>
		</CountrySwitcherContainer>
	),
};
