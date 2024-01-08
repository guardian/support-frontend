import { css, ThemeProvider } from '@emotion/react';
import { cmp } from '@guardian/consent-management-platform';
import { from, palette, space } from '@guardian/source-foundations';
import {
	Button,
	buttonThemeReaderRevenueBrand,
	Container,
} from '@guardian/source-react-components';
import {
	FooterLinks,
	FooterWithContents,
} from '@guardian/source-react-components-development-kitchen';
import { useEffect } from 'preact/hooks';
import { useNavigate } from 'react-router';
import CountryGroupSwitcher from 'components/countryGroupSwitcher/countryGroupSwitcher';
import type { CountryGroupSwitcherProps } from 'components/countryGroupSwitcher/countryGroupSwitcher';
import { CountrySwitcherContainer } from 'components/headers/simpleHeader/countrySwitcherContainer';
import { Header } from 'components/headers/simpleHeader/simpleHeader';
import { PageScaffold } from 'components/page/pageScaffold';
import { useOtherAmountValidation } from 'helpers/customHooks/useFormValidation';
import {
	AUDCountries,
	Canada,
	EURCountries,
	GBPCountries,
	International,
	NZDCountries,
	UnitedStates,
} from 'helpers/internationalisation/countryGroup';
import { resetValidation } from 'helpers/redux/checkout/checkoutActions';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import { getUserSelectedAmount } from 'helpers/redux/checkout/product/selectors/selectedAmount';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import { navigateWithPageView } from 'helpers/tracking/ophan';

const checkoutBtnStyleOverrides = css`
	width: 100%;
	justify-content: center;
`;

const recurringContainer = css`
	background-color: ${palette.brand[400]};
	border-bottom: 1px solid ${palette.brand[600]};

	${from.tablet} {
		border-bottom: none;
	}
	> div {
		padding: ${space[2]}px 10px ${space[4]}px;
	}
	${from.desktop} {
		> div {
			padding: 40px 10px ${space[6]}px;
		}
	}
`;

const oneTimeContainer = css`
	display: flex;
	background-color: ${palette.brand[800]};
	> div {
		padding: ${space[6]}px 10px 72px;
	}
	${from.desktop} {
		> div {
			padding-top: 32px;
		}
	}
`;

const links = [
	{
		href: 'https://www.theguardian.com/info/privacy',
		text: 'Privacy policy',
		isExternal: true,
	},
	{
		text: 'Privacy settings',
		onClick: () => {
			cmp.showPrivacyManager();
		},
	},
	{
		href: 'https://www.theguardian.com/help/contact-us',
		text: 'Contact us',
		isExternal: true,
	},
	{
		href: 'https://www.theguardian.com/help',
		text: 'Help centre',
		isExternal: true,
	},
];

export function ThreeTierLanding(): JSX.Element {
	const dispatch = useContributionsDispatch();
	const navigate = useNavigate();
	const contributionType = useContributionsSelector(getContributionType);
	const amount = useContributionsSelector(getUserSelectedAmount);

	const { abParticipations } = useContributionsSelector(
		(state) => state.common,
	);

	const { countryGroupId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);

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
		selectedCountryGroup: countryGroupId,
		subPath: '/contribute',
	};

	const proceedToNextStep = useOtherAmountValidation(() => {
		const destination = `checkout?selected-amount=${amount}&selected-contribution-type=${contributionType.toLowerCase()}`;
		navigateWithPageView(navigate, destination, {
			participations: abParticipations,
		});
	}, false);

	useEffect(() => {
		dispatch(resetValidation());
	}, []);

	return (
		<PageScaffold
			header={
				<>
					<Header>
						<CountrySwitcherContainer>
							<CountryGroupSwitcher {...countrySwitcherProps} />
						</CountrySwitcherContainer>
					</Header>
				</>
			}
			footer={
				<FooterWithContents>
					<FooterLinks links={links}></FooterLinks>
				</FooterWithContents>
			}
		>
			<Container
				sideBorders
				topBorder
				borderColor="rgba(170, 170, 180, 0.5)"
				cssOverrides={recurringContainer}
			>
				<h1>Support fearless, independent journalism</h1>
				<ThemeProvider theme={buttonThemeReaderRevenueBrand}>
					<Button
						iconSide="left"
						priority="primary"
						size="default"
						cssOverrides={checkoutBtnStyleOverrides}
						onClick={proceedToNextStep}
					>
						Support with XX
					</Button>
				</ThemeProvider>
			</Container>
			<Container
				sideBorders
				borderColor="rgba(170, 170, 180, 0.5)"
				cssOverrides={oneTimeContainer}
			>
				<p>one time placeholder</p>
			</Container>
		</PageScaffold>
	);
}
