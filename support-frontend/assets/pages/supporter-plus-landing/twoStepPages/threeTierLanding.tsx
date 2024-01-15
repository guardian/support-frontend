import { css } from '@emotion/react';
import { cmp } from '@guardian/consent-management-platform';
import {
	from,
	headline,
	palette,
	space,
	textSans,
} from '@guardian/source-foundations';
import { Container } from '@guardian/source-react-components';
import {
	FooterLinks,
	FooterWithContents,
} from '@guardian/source-react-components-development-kitchen';
import { useEffect } from 'preact/hooks';
import { useNavigate } from 'react-router-dom';
import CountryGroupSwitcher from 'components/countryGroupSwitcher/countryGroupSwitcher';
import type { CountryGroupSwitcherProps } from 'components/countryGroupSwitcher/countryGroupSwitcher';
import { CountrySwitcherContainer } from 'components/headers/simpleHeader/countrySwitcherContainer';
import { Header } from 'components/headers/simpleHeader/simpleHeader';
import { PageScaffold } from 'components/page/pageScaffold';
import { PaymentFrequencyButtons } from 'components/paymentFrequencyButtons/paymentFrequencyButtons';
import type { RegularContributionType } from 'helpers/contributions';
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
import {
	setProductType,
	setSelectedAmount,
} from 'helpers/redux/checkout/product/actions';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import { navigateWithPageView } from 'helpers/tracking/ophan';
import { SupportOnce } from '../components/supportOnce';
import { ThreeTierCards } from '../components/threeTierCards';

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
			padding: 40px 10px ${space[6]}px;
		}
	}
`;

const oneTimeContainer = css`
	display: flex;
	background-color: ${palette.neutral[97]};
	> div {
		padding: ${space[6]}px 10px 72px;
	}
	${from.desktop} {
		> div {
			padding-bottom: ${space[24]}px;
		}
	}
`;

const innerContentContainer = css`
	max-width: 940px;
	margin: 0 auto;
	text-align: center;
`;

const heading = css`
	text-align: left;
	color: ${palette.neutral[100]};
	margin-top: ${space[4]}px;
	${headline.xsmall({
		fontWeight: 'bold',
	})}
	${from.tablet} {
		text-align: center;
	}
	${from.desktop} {
		font-size: 2.625rem;
	}
`;

const standFirst = css`
	text-align: left;
	color: ${palette.neutral[100]};
	margin: 0 0 ${space[4]}px;
	${textSans.medium()};
	line-height: 1.35;
	strong {
		font-weight: bold;
	}
	${from.tablet} {
		text-align: center;
		width: 65%;
		margin: 0 auto;
	}
	${from.desktop} {
		margin: ${space[4]}px auto ${space[6]}px;
	}
`;

const benefitsPrefixCss = css`
	${textSans.small()};
	color: ${palette.neutral[7]};
	text-align: left;
	strong {
		font-weight: bold;
	}
`;

const paymentFrequencyButtonsCss = css`
	margin: ${space[4]}px auto 32px;
	${from.desktop} {
		margin: ${space[6]}px auto ${space[12]}px;
	}
`;

const benefitsPrefixPlus = css`
	${textSans.small()};
	color: ${palette.neutral[7]};
	display: flex;
	align-items: center;
	margin: ${space[3]}px 0;
	:before {
		content: '';
		height: 1px;
		background-color: ${palette.neutral[86]};
		flex-grow: 2;
		margin-right: ${space[2]}px;
	}
	:after {
		content: '';
		height: 1px;
		background-color: ${palette.neutral[86]};
		flex-grow: 2;
		margin-left: ${space[2]}px;
	}
`;

const tabletLineBreak = css`
	${from.desktop} {
		display: none;
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

	const productType = useContributionsSelector(getContributionType);

	useEffect(() => {
		dispatch(resetValidation());
		if (productType === 'ONE_OFF') {
			dispatch(setProductType('MONTHLY'));
			/*
			 * Resets the product type to be a recurring type so
			 * that the cards show monthly or annual values. This
			 * happens if a user comes back to this page from the
			 * one off contribution checkout
			 */
		}
	}, []);

	const paymentFrequencies: RegularContributionType[] = ['MONTHLY', 'ANNUAL'];
	const paymentFrequencyMap = {
		MONTHLY: 'Monthly',
		ANNUAL: 'Annual',
	};

	const handlePaymentFrequencyBtnClick = (buttonIndex: number) => {
		dispatch(setProductType(paymentFrequencies[buttonIndex]));
	};

	const handleCardCtaClick = (price: string) => {
		dispatch(
			setSelectedAmount({
				contributionType: productType,
				amount: price,
			}),
		);
		navigateWithPageView(navigate, 'checkout', abParticipations);
	};

	const handleSupportOnceBtnClick = () => {
		dispatch(setProductType('ONE_OFF'));
		navigateWithPageView(navigate, 'checkout', abParticipations);
	};

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
				<div css={innerContentContainer}>
					<h1 css={heading}>
						Support fearless, <br css={tabletLineBreak} />
						independent journalism
					</h1>
					<p css={standFirst}>
						Here comes body copy about the support option below.{' '}
						<strong>Cancel anytime.</strong>
					</p>
					<PaymentFrequencyButtons
						paymentFrequencies={paymentFrequencies.map(
							(paymentFrequency, index) => ({
								label: paymentFrequencyMap[paymentFrequency],
								isPreSelected: paymentFrequencies[index] === productType,
							}),
						)}
						buttonClickHandler={handlePaymentFrequencyBtnClick}
						additionalStyles={paymentFrequencyButtonsCss}
					/>
					<ThreeTierCards
						cardsContent={[
							{
								cardTitle: 'Support',
								currentPrice: productType === 'MONTHLY' ? '4' : '400',
								benefits: [
									{
										copy: 'Regular supporter newsletter from inside our newsroom',
									},
									{ copy: 'See far fewer asks for support' },
								],
							},
							{
								cardTitle: 'All access digital',
								currentPrice: productType === 'MONTHLY' ? '10' : '1000',
								isRecommended: true,
								benefits: [
									{
										copy: 'Guardian news app with personalised recommendations and offline reading',
									},
									{ copy: 'Ad-free reading on all your digital devices' },
									{
										copy: 'Regular supporter newsletter from inside our newsroom',
									},
									{ copy: 'See far fewer asks for support' },
								],
							},
							{
								cardTitle: 'Digital + print',
								previousPrice: productType === 'MONTHLY' ? '25' : '2500',
								currentPrice: productType === 'MONTHLY' ? '16' : '1600',
								priceSuffix:
									productType === 'MONTHLY'
										? '£16 for the first 12 months, then £25'
										: '£1600 for the first 12 months, then £2500',
								benefits: [
									{
										copy: 'Guardian Weekly magazine delivered to your door, offering a digestible view of world news.',
										tooltip: 'tooltip text',
									},
								],
								benefitsPrefix: (
									<div css={benefitsPrefixCss}>
										<span>
											All features of <strong>All access digital</strong>
										</span>
										<span css={benefitsPrefixPlus}>plus</span>
									</div>
								),
							},
						]}
						currency="£"
						paymentFrequency={productType as RegularContributionType}
						cardsCtaClickHandler={handleCardCtaClick}
					/>
				</div>
			</Container>
			<Container
				sideBorders
				borderColor="rgba(170, 170, 180, 0.5)"
				cssOverrides={oneTimeContainer}
			>
				<SupportOnce btnClickHandler={handleSupportOnceBtnClick} />
			</Container>
		</PageScaffold>
	);
}
