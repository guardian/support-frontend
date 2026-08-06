import { css } from '@emotion/react';
import {
	FooterLinks,
	FooterWithContents,
} from '@guardian/source-development-kitchen/react-components';
import type { ReactNode } from 'react';
import { CheckoutHeading } from 'components/checkoutHeading/checkoutHeading';
import { CountrySwitcherContainer } from 'components/headers/simpleHeader/countrySwitcherContainer';
import { Header } from 'components/headers/simpleHeader/simpleHeader';
import { PageScaffold } from 'components/page/pageScaffold';
import SupportRegionSwitcher from '../../../components/supportRegionSwitcher/supportRegionSwitcher';
import type { SupportRegionSwitcherProps } from '../../../components/supportRegionSwitcher/supportRegionSwitcher';

const checkoutHeadingHeight = css`
	max-height: 332px;
	height: 332px;
`;

type LandingPageLayoutProps = {
	children: ReactNode;
	countrySwitcherProps: SupportRegionSwitcherProps;
};

export function LandingPageLayout({
	children,
	countrySwitcherProps,
}: LandingPageLayoutProps) {
	const multipleCountries = countrySwitcherProps.supportRegionIds.length > 1;
	return (
		<PageScaffold
			header={
				<>
					<Header>
						{multipleCountries && (
							<CountrySwitcherContainer>
								<SupportRegionSwitcher {...countrySwitcherProps} />
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
			<CheckoutHeading
				withTopBorder={false}
				withSideBorders={false}
				cssOverrides={checkoutHeadingHeight}
			/>
			{children}
		</PageScaffold>
	);
}
