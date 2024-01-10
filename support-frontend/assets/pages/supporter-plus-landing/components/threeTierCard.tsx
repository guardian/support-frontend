import { css, ThemeProvider } from '@emotion/react';
import {
	from,
	palette,
	space,
	textSans,
	until,
} from '@guardian/source-foundations';
import {
	Button,
	buttonThemeReaderRevenueBrand,
} from '@guardian/source-react-components';
import { CheckmarkList } from 'components/checkmarkList/checkmarkList';
import type { RegularContributionType } from 'helpers/contributions';
import type { PlanCosts, TierBenefits } from '../setup/threeTierConfig';
import { ThreeTierLozenge } from './threeTierLozenge';

interface ThreeTierCardProps {
	title: string;
	isRecommended?: true;
	benefits: TierBenefits;
	planCost: PlanCosts;
	currency: string;
	paymentFrequency: RegularContributionType;
	cardCtaClickHandler: (price: number) => void;
}

const container = (isRecommended?: boolean) => css`
	position: ${isRecommended ? 'relative' : 'static'};
	background-color: ${isRecommended ? '#F1FBFF' : palette.neutral[100]};
	border-radius: ${space[3]}px;
	padding: 32px ${space[3]}px ${space[6]}px ${space[3]}px;
	${until.desktop} {
		order: ${isRecommended ? 0 : 1};
		padding-top: ${space[6]}px;
	}
`;

const titleCss = css`
	${textSans.small({ fontWeight: 'bold' })};
	color: #606060;
`;

const price = (hasPriceSuffix: boolean) => css`
	${textSans.xlarge({ fontWeight: 'bold' })};
	position: relative;
	margin-bottom: ${hasPriceSuffix ? '0' : `${space[4]}px`};
	${from.desktop} {
		margin-bottom: ${space[6]}px;
	}
`;

const priceSuffixCss = css`
	display: block;
	font-size: ${space[3]}px;
	font-weight: 400;
	color: #606060;
	margin-bottom: ${space[4]}px;
	${from.desktop} {
		position: absolute;
		top: 100%;
		left: 0;
		width: 100%;
		text-align: center;
		margin-bottom: 0;
	}
`;

const previousPriceStrikeThrough = css`
	font-weight: 400;
	text-decoration: line-through;
`;

const btnStyleOverrides = css`
	width: 100%;
	justify-content: center;
	margin-bottom: ${space[6]}px;
`;

const checkmarkList = css`
	width: 100%;
	text-align: left;
	${from.desktop} {
		width: 90%;
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

const frequencyCopyMap = {
	MONTHLY: 'month',
	ANNUAL: 'year',
};

const priceSuffixCopy = (currency: string, planCost: PlanCosts) => {
	// EXAMPLE: £16 for the first 12 months, then £25
	if (!planCost.discount) {
		return '';
	}
	return `${currency}${planCost.discount.price} for the first ${
		planCost.discount.duration.value > 1 ? planCost.discount.duration.value : ''
	} ${frequencyCopyMap[planCost.discount.duration.period]}${
		planCost.discount.duration.value > 1 ? 's' : ''
	}, then ${currency}${planCost.price}`;
};

export function ThreeTierCard({
	title,
	planCost,
	isRecommended,
	benefits,
	currency,
	paymentFrequency,
	cardCtaClickHandler,
}: ThreeTierCardProps): JSX.Element {
	const currentPrice = planCost.discount?.price ?? planCost.price;
	const previousPriceCopy =
		!!planCost.discount && `${currency}${planCost.price}`;
	const currentPriceCopy = `${currency}${currentPrice}/${frequencyCopyMap[paymentFrequency]}`;

	return (
		<div css={container(isRecommended)}>
			{isRecommended && <ThreeTierLozenge title="Recommended" />}
			<h3 css={titleCss}>{title}</h3>
			<h2 css={price(!!planCost.discount)}>
				<span css={previousPriceStrikeThrough}>{previousPriceCopy}</span>
				{previousPriceCopy && ' '}
				{currentPriceCopy}
				{!!planCost.discount && (
					<span css={priceSuffixCss}>
						{priceSuffixCopy(currency, planCost)}
					</span>
				)}
			</h2>
			<ThemeProvider theme={buttonThemeReaderRevenueBrand}>
				<Button
					iconSide="left"
					priority="primary"
					size="default"
					cssOverrides={btnStyleOverrides}
					onClick={() => cardCtaClickHandler(currentPrice)}
				>
					Support now
				</Button>
			</ThemeProvider>

			{benefits.description && (
				<div css={benefitsPrefixCss}>
					<span>
						{benefits.description.map((stringPart) => {
							if (typeof stringPart === 'string') {
								return stringPart;
							} else {
								return <strong>{stringPart.copy}</strong>;
							}
						})}
					</span>
					<span css={benefitsPrefixPlus}>plus</span>
				</div>
			)}
			<CheckmarkList
				checkListData={benefits.list.map((benefit) => {
					return { text: <span>{benefit.copy}</span>, isChecked: true };
				})}
				style={'compact'}
				iconColor={palette.brand[500]}
				cssOverrides={checkmarkList}
			/>
		</div>
	);
}
