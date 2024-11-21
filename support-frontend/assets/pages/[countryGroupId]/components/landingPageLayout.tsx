import { css } from '@emotion/react';
import { from, palette, space } from '@guardian/source/foundations';
import { Container } from '@guardian/source/react-components';
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

const recurringContainer = css`
	background-color: ${palette.brand[400]};
	border-bottom: 1px solid ${palette.brand[600]};
	> div {
		padding: ${space[2]}px 10px ${space[4]}px;
	}
	${from.mobileLandscape} {
		> div {
			padding: ${space[2]}px ${space[5]}px ${space[4]}px;
		}
	}
	${from.tablet} {
		border-bottom: none;
		> div {
			padding: ${space[2]}px 10px ${space[4]}px;
		}
	}
	${from.desktop} {
		> div {
			padding: 40px 10px 72px;
		}
	}
`;

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
			<Container
				sideBorders
				topBorder
				borderColor="rgba(170, 170, 180, 0.5)"
				cssOverrides={recurringContainer}
			>
				{children}
			</Container>
		</PageScaffold>
	);
}
