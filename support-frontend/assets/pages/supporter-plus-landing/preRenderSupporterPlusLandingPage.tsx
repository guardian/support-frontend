import { css } from '@emotion/react';
import {
	from,
	neutral,
	palette,
	space,
	textSans,
	until,
} from '@guardian/source/foundations';
import {
	Column,
	Columns,
	Hide,
	SvgGuardianLogo,
} from '@guardian/source/react-components';
import {
	FooterLinks,
	FooterWithContents,
} from '@guardian/source-development-kitchen/react-components';
import { CheckoutHeading } from 'components/checkoutHeading/checkoutHeading';
import type { CountryGroupSwitcherProps } from 'components/countryGroupSwitcher/countryGroupSwitcher';
import CountryGroupSwitcher from 'components/countryGroupSwitcher/countryGroupSwitcher';
import { CountrySwitcherContainer } from 'components/headers/simpleHeader/countrySwitcherContainer';
import { Header } from 'components/headers/simpleHeader/simpleHeader';
import { Container } from 'components/layout/container';
import Nav from 'components/nav/nav';
import { PageScaffold } from 'components/page/pageScaffold';
import {
	AUDCountries,
	Canada,
	EURCountries,
	GBPCountries,
	International,
	NZDCountries,
	UnitedStates,
} from 'helpers/internationalisation/countryGroup';
import { PrerenderGlobalStyles } from 'helpers/rendering/prerenderGlobalStyles';

const checkoutContainer = css`
	position: relative;
	color: ${neutral[7]};
	${textSans.medium()};

	padding-top: ${space[3]}px;
	padding-bottom: ${space[9]}px;

	${from.tablet} {
		padding-bottom: ${space[12]}px;
	}

	${from.desktop} {
		padding-top: ${space[6]}px;
	}
`;

const darkBackgroundContainerMobile = css`
	background-color: ${palette.neutral[97]};
	${until.tablet} {
		background-color: ${palette.brand[400]};
		border-bottom: 1px solid ${palette.brand[600]};
	}
`;

const countrySwitcherProps: CountryGroupSwitcherProps = {
	countryGroupIds: [
		GBPCountries,
		UnitedStates,
		AUDCountries,
		EURCountries,
		NZDCountries,
		Canada,
		International,
	],
	selectedCountryGroup: GBPCountries,
	subPath: '/contribute',
};

export function PreRenderSupporterPlusLandingPage(): JSX.Element {
	return (
		<PageScaffold
			header={
				<>
					<Header>
						<Hide from="desktop">
							<CountrySwitcherContainer>
								<CountryGroupSwitcher {...countrySwitcherProps} />
							</CountrySwitcherContainer>
						</Hide>
					</Header>
					<Nav {...countrySwitcherProps} />
				</>
			}
			footer={
				<FooterWithContents>
					<FooterLinks></FooterLinks>
				</FooterWithContents>
			}
		>
			<PrerenderGlobalStyles />
			<CheckoutHeading>
				<p></p>
			</CheckoutHeading>
			<Container sideBorders cssOverrides={darkBackgroundContainerMobile}>
				<Columns cssOverrides={checkoutContainer} collapseUntil="tablet">
					<Column span={[0, 2, 5]}></Column>
					<Column span={[1, 8, 7]}></Column>
				</Columns>
			</Container>
		</PageScaffold>
	);
}

function PreRenderBlank() {
	return (
		<div>
			<SvgGuardianLogo />
		</div>
	);
}

export const supporterPlusLanding = <PreRenderBlank />; // <PreRenderSupporterPlusLandingPage />;
