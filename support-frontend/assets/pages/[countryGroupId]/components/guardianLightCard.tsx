import { css, ThemeProvider } from '@emotion/react';
import {
	brand,
	from,
	headlineBold24,
	headlineLight17,
	neutral,
	palette,
	space,
	textSans15,
	until,
} from '@guardian/source/foundations';
import {
	buttonThemeReaderRevenueBrand,
	LinkButton,
} from '@guardian/source/react-components';
import { BenefitsCheckList } from 'components/checkoutBenefits/benefitsCheckList';
import type { RegularContributionType } from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import {
	filterBenefitByRegion,
	type ProductDescription,
} from 'helpers/productCatalog';

export type CardPosition = 1 | 2;

export type GuardianLightProps = {
	cardPosition: CardPosition;
	currencyId: IsoCurrency;
	countryGroupId: CountryGroupId;
	paymentFrequency: RegularContributionType;
	link: string;
	productDescription: ProductDescription;
	price: number;
	ctaCopy: string;
};

const container = () => {
	const cardOrder = 2;
	return css`
		position: 'static';
		background-color: ${palette.neutral[100]};
		border-radius: ${space[3]}px;
		padding: 32px ${space[3]}px ${space[6]}px ${space[3]}px;

		${until.desktop} {
			order: ${cardOrder};
			padding-top: ${space[6]}px;
			margin-top: ${'0'}px;
		}
	`;
};

const titleSummaryCss = css`
	display: flex;
	flex-direction: column;
	width: 100%;
	align-items: center;

	margin-bottom: ${`${space[4]}px`};
	${from.desktop} {
		margin-bottom: ${space[6]}px;
	}
`;

const titleCss = css`
	${headlineBold24};
	color: ${neutral[7]};
`;

const summaryCss = css`
	${headlineLight17};
`;

const btnStyleOverrides = css`
	width: 100%;
	justify-content: center;
	margin-bottom: ${space[6]}px;
	background-color: ${brand[400]};
	color: ${neutral[100]};
`;

const checkmarkBenefitList = css`
	width: 100%;
	text-align: left;

	${from.desktop} {
		width: 90%;
	}
`;

const checkmarkOfferList = css`
	width: 100%;
	text-align: left;
`;

const benefitsPrefixCss = css`
	${textSans15};
	color: ${palette.neutral[7]};
	text-align: left;

	strong {
		font-weight: bold;
	}
`;

const benefitsPrefixPlus = css`
	${textSans15};
	color: #545454; // neutral[38] unavailable
	display: flex;
	align-items: center;
	margin: ${space[3]}px 0;

	:before,
	:after {
		content: '';
		height: 1px;
		background-color: ${palette.neutral[86]};
		flex-grow: 2;
	}

	:before {
		margin-right: ${space[2]}px;
	}

	:after {
		margin-left: ${space[2]}px;
	}
`;

export function GuardianLightCard({
	cardPosition,
	countryGroupId,
	link,
	productDescription,
	ctaCopy,
}: GuardianLightProps): JSX.Element {
	const quantumMetricButtonRef = `guardianLight-${cardPosition}-button`;
	const { label, benefits, benefitsSummary, offers, offersSummary } =
		productDescription;

	return (
		<section css={container}>
			<div css={titleSummaryCss}>
				{productDescription.icon}
				<h2 css={titleCss}>{label}</h2>
				<p css={summaryCss}>{productDescription.summary}</p>
			</div>
			<ThemeProvider theme={buttonThemeReaderRevenueBrand}>
				<LinkButton
					href={link}
					cssOverrides={btnStyleOverrides}
					data-qm-trackable={quantumMetricButtonRef}
				>
					{ctaCopy}
				</LinkButton>
			</ThemeProvider>

			{benefitsSummary && (
				<div css={benefitsPrefixCss}>
					<span>
						{benefitsSummary.map((stringPart) => {
							if (typeof stringPart !== 'string') {
								return <strong>{stringPart.copy}</strong>;
							} else {
								return stringPart;
							}
						})}
					</span>
				</div>
			)}
			{offersSummary && (
				<div css={benefitsPrefixCss}>
					<span>
						{offersSummary.map((stringPart) => {
							if (typeof stringPart !== 'string') {
								return <strong>{stringPart.copy}</strong>;
							} else {
								return stringPart;
							}
						})}
					</span>
				</div>
			)}
			{(benefitsSummary ?? offersSummary) && (
				<span css={benefitsPrefixPlus}>plus</span>
			)}
			<BenefitsCheckList
				benefitsCheckListData={benefits
					.filter((benefit) => filterBenefitByRegion(benefit, countryGroupId))
					.map((benefit) => {
						return {
							text: benefit.copy,
							isChecked: true,
							toolTip: benefit.tooltip,
							isNew: benefit.isNew,
						};
					})}
				style={'noIcon'}
				iconColor={palette.brand[500]}
				cssOverrides={checkmarkBenefitList}
			/>
			{offers && offers.length > 0 && (
				<>
					<span css={benefitsPrefixPlus}>new</span>
					<BenefitsCheckList
						benefitsCheckListData={offers.map((offer) => {
							return {
								text: offer.copy,
								isChecked: false,
								toolTip: offer.tooltip,
							};
						})}
						style={'hidden'}
						iconColor={palette.brand[500]}
						cssOverrides={checkmarkOfferList}
					/>
				</>
			)}
		</section>
	);
}
