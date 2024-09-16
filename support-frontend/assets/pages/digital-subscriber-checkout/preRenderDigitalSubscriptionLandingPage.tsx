import { css } from '@emotion/react';
import { from, neutral, space, textSans17 } from '@guardian/source/foundations';
import { Column, Columns, Hide } from '@guardian/source/react-components';
import {
	FooterLinks,
	FooterWithContents,
} from '@guardian/source-development-kitchen/react-components';
import { Box } from 'components/checkoutBox/checkoutBox';
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
import { LandingPageHeading } from 'pages/digital-subscriber-checkout/components/landingPageHeading';

const checkoutContainer = css`
	position: relative;
	color: ${neutral[7]};
	${textSans17};

	padding-top: ${space[3]}px;
	padding-bottom: ${space[9]}px;

	${from.tablet} {
		padding-bottom: ${space[12]}px;
	}

	${from.desktop} {
		padding-top: ${space[6]}px;
	}
`;

const emptyBox = css`
	height: 500px;
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
	subPath: '/subscribe/digitaledition',
};

function PreRenderDigitalSubscriptionLandingPage(): JSX.Element {
	const heading = (
		<LandingPageHeading heading="Under no one’s thumb but yours" />
	);

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
			<CheckoutHeading heading={heading}>
				<p></p>
			</CheckoutHeading>
			<Container sideBorders backgroundColor={neutral[97]}>
				<Columns cssOverrides={checkoutContainer} collapseUntil="tablet">
					<Column span={[0, 2, 5]}></Column>
					<Column span={[1, 8, 7]}>
						<Hide from="desktop">{heading}</Hide>
						<Box>
							<div css={emptyBox}></div>
						</Box>
						<Box>
							<div css={emptyBox}></div>
						</Box>
					</Column>
				</Columns>
			</Container>
		</PageScaffold>
	);
}

export const digitalSubscriptionLandingPage = (
	<PreRenderDigitalSubscriptionLandingPage />
);
