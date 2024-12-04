import {
	FooterLinks,
	FooterWithContents,
} from '@guardian/source-development-kitchen/react-components';
import type { ReactNode } from 'react';
import type { CountryGroupSwitcherProps } from 'components/countryGroupSwitcher/countryGroupSwitcher';
import CountryGroupSwitcher from 'components/countryGroupSwitcher/countryGroupSwitcher';
import { CountrySwitcherContainer } from 'components/headers/simpleHeader/countrySwitcherContainer';
import { Header } from 'components/headers/simpleHeader/simpleHeader';
import { PageScaffold } from 'components/page/pageScaffold';

type LandingPageLayoutProps = {
	children: ReactNode;
	countrySwitcherProps: CountryGroupSwitcherProps;
};

export function LandingPageLayout({
	children,
	countrySwitcherProps,
}: LandingPageLayoutProps) {
	const multipleCountries = countrySwitcherProps.countryGroupIds.length > 1;
	return (
		<PageScaffold
			header={
				<>
					<Header>
						{multipleCountries && (
							<CountrySwitcherContainer>
								<CountryGroupSwitcher {...countrySwitcherProps} />
							</CountrySwitcherContainer>
						)}
					</Header>
				</>
			}
			footer={
				<FooterWithContents>
					<FooterLinks></FooterLinks>
				</FooterWithContents>
			}
		>
			{children}
		</PageScaffold>
	);
}
