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
import { ThreeTierLozenge } from './threeTierLozenge';

interface ThreeTierCardProps {
	cardTitle: string;
	currentPrice: string;
	previousPrice?: string;
	priceSuffix?: string;
	isRecommended?: true;
	benefits: Array<{ copy: string; tooltip?: string }>;
	benefitsPrefix?: string | JSX.Element;
	currency: string;
	paymentFrequency: RegularContributionType;
	cardCtaClickHandler: (price: string) => void;
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

const title = css`
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

export function ThreeTierCard({
	cardTitle,
	currentPrice,
	previousPrice,
	priceSuffix,
	isRecommended,
	benefits,
	benefitsPrefix,
	currency,
	paymentFrequency,
	cardCtaClickHandler,
}: ThreeTierCardProps): JSX.Element {
	const frequencyCopyMap = {
		MONTHLY: 'month',
		ANNUAL: 'year',
	};
	const previousPriceCopy = previousPrice && `${currency}${previousPrice}`;
	const currentPriceCopy = `${currency}${currentPrice}/${frequencyCopyMap[paymentFrequency]}`;
	return (
		<div css={container(isRecommended)}>
			{isRecommended && <ThreeTierLozenge title="Recommended" />}
			<h3 css={title}>{cardTitle}</h3>
			<h2 css={price(!!priceSuffix)}>
				<span css={previousPriceStrikeThrough}>{previousPriceCopy}</span>
				{previousPriceCopy && ' '}
				{currentPriceCopy}
				{priceSuffix && <span css={priceSuffixCss}>{priceSuffix}</span>}
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
			{benefitsPrefix}
			<CheckmarkList
				checkListData={benefits.map((benefit) => {
					return { text: <span>{benefit.copy}</span>, isChecked: true };
				})}
				style={'compact'}
				iconColor={palette.brand[500]}
				cssOverrides={checkmarkList}
			/>
		</div>
	);
}
