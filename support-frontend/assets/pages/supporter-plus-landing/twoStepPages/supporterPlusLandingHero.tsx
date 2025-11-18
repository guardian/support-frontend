import { css } from '@emotion/react';
import {
	from,
	headlineBold28,
	headlineMedium34,
	palette,
	space,
	textSans15,
	textSans17,
	textSansBold15,
} from '@guardian/source/foundations';
import {
	LinkButton,
	themeButtonReaderRevenueBrand,
} from '@guardian/source/react-components';
import type { IsoCurrency } from '@modules/internationalisation/currency';
import { getCurrencyInfo } from '@modules/internationalisation/currency';
import type { BillingPeriod } from '@modules/product/billingPeriod';
import { simpleFormatAmount } from '../../../helpers/forms/checkouts';
import type {
	CountdownSettings,
	TickerSettings,
} from '../../../helpers/globalsAndSwitches/landingPageSettings';
import { getBillingPeriodNoun } from '../../../helpers/productPrice/billingPeriods';
import Countdown from '../components/countdown';
import type { CardContent } from '../components/threeTierCard';
import { TickerContainer } from './tickerContainer';

type SupporterPlusLandingHeroProps = {
	heroImageUrl?: string;
	headingHtml: string;
	subheadingHtml: string;
	tickerSettings?: TickerSettings;
	countdownSettings?: CountdownSettings;
	setHeadingOverride: (headingOverride: string | undefined) => void;
	tierTwoCard: CardContent;
	billingPeriod: BillingPeriod;
	currencyId: IsoCurrency;
};

const heroSection = (heroImageUrl?: string) => css`
	background-color: ${palette.brand[400]};
	background-image: ${heroImageUrl
		? `linear-gradient(180deg, rgba(3, 9, 44, 0.8), rgba(4, 10, 43, 0.7), rgba(4, 10, 43, 0.9)), url(${heroImageUrl})`
		: `linear-gradient(180deg, rgba(3, 9, 44, 0.8), rgba(4, 10, 43, 0.9))`};
	background-size: cover;
	background-position: center;
	color: ${palette.neutral[100]};
	display: flex;
	align-items: center;
	justify-content: center;

	${from.desktop} {
		justify-content: flex-end;
		padding: ${space[6]}px ${space[24]}px ${space[10]}px ${space[24]}px;
	}
`;

const heroInner = css`
	max-width: 456px;
	margin: 0;
	padding: 0;

	${from.desktop} {
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}
`;

const countdownContainer = css`
	display: flex;
	justify-content: center;

	${from.desktop} {
		justify-content: flex-start;
	}
`;

const heroContent = css`
	background-color: ${palette.neutral[97]};
	color: ${palette.neutral[7]};
	border-radius: ${space[3]}px;
	padding: ${space[5]}px ${space[5]}px;
	box-shadow: 0 20px 40px rgba(3, 9, 44, 0.35);

	${from.tablet} {
		padding: ${space[4]}px;
	}
`;

const heroTextColumn = css`
	text-align: left;
	margin-bottom: ${space[4]}px;
`;

const heroHeading = css`
	${headlineMedium34};
	color: ${palette.sport[400]};
	margin: 0 0 ${space[3]}px;
`;

const heroSubheading = css`
	${textSans17};
	margin: 0;
	line-height: 1.4;
`;

const tickerOverrides = css`
	margin: ${space[3]}px 0 ${space[2]}px 0;
	max-width: 460px;
	margin-right: auto;
`;

const heroCard = css`
	background-color: ${palette.neutral[100]};
	border-radius: ${space[2]}px;
	color: ${palette.neutral[7]};
	display: flex;
	flex-direction: column;
	padding: ${space[2]}px;
	width: 100%;
	align-items: center;
`;

const heroCardBadge = css`
	${textSansBold15};
	display: inline-flex;
	text-transform: uppercase;
	color: ${palette.brand[400]};
	background: rgba(2, 31, 71, 0.1);
	border-radius: ${space[1]}px;
	padding: 3px ${space[3]}px;
	margin-bottom: ${space[3]}px;
`;

const heroCardTitle = css`
	${textSansBold15};
	text-transform: none;
	color: ${palette.neutral[38]};
`;

const heroCardPrice = css`
	${headlineBold28};
	color: ${palette.neutral[7]};
	margin-bottom: ${space[3]}px;
`;

const previousPrice = css`
	${textSans15};
	color: ${palette.neutral[46]};
	text-decoration: line-through;
	margin-right: ${space[2]}px;
`;

const billingPeriodCopy = css`
	${textSans15};
	color: ${palette.neutral[46]};
	margin-left: ${space[1]}px;
`;

const heroCardButton = css`
	width: 100%;
	justify-content: center;
`;

export function SupporterPlusLandingHero({
	heroImageUrl,
	headingHtml,
	subheadingHtml,
	tickerSettings,
	countdownSettings,
	setHeadingOverride,
	tierTwoCard,
	billingPeriod,
	currencyId,
}: SupporterPlusLandingHeroProps): JSX.Element {
	const currency = getCurrencyInfo(currencyId);
	const discountedPrice = tierTwoCard.promotion?.discountedPrice;
	const activePrice = discountedPrice ?? tierTwoCard.price;
	const formattedPrice = simpleFormatAmount(currency, activePrice);
	const previousPriceCopy =
		discountedPrice && discountedPrice !== tierTwoCard.price
			? simpleFormatAmount(currency, tierTwoCard.price)
			: undefined;
	const billingPeriodLabel = getBillingPeriodNoun(billingPeriod);

	return (
		<section css={heroSection(heroImageUrl)}>
			<div css={heroInner}>
				<div>
					{countdownSettings && (
						<div css={countdownContainer}>
							<Countdown
								countdownSettings={countdownSettings}
								setHeadingOverride={setHeadingOverride}
							/>
						</div>
					)}
					<div css={heroContent}>
						<div css={heroTextColumn}>
							<h1 css={heroHeading}>
								<span dangerouslySetInnerHTML={{ __html: headingHtml }} />
							</h1>
							{tickerSettings && (
								<TickerContainer
									tickerSettings={tickerSettings}
									cssOverrides={tickerOverrides}
								/>
							)}
							<p
								css={heroSubheading}
								dangerouslySetInnerHTML={{ __html: subheadingHtml }}
							/>
						</div>
						<div css={heroCard}>
							{(tierTwoCard.label?.copy
								? tierTwoCard.label.copy
								: tierTwoCard.titlePill) && (
								<div css={heroCardBadge}>
									{tierTwoCard.label?.copy ?? tierTwoCard.titlePill}
								</div>
							)}
							<h2 css={heroCardTitle}>{tierTwoCard.title}</h2>
							<div css={heroCardPrice}>
								{previousPriceCopy && (
									<span css={previousPrice}>{previousPriceCopy}</span>
								)}
								<span>
									{formattedPrice}
									<span css={billingPeriodCopy}>/{billingPeriodLabel}</span>
								</span>
							</div>
							<LinkButton
								href={tierTwoCard.link}
								cssOverrides={heroCardButton}
								priority="primary"
								theme={themeButtonReaderRevenueBrand}
							>
								{tierTwoCard.cta.copy}
							</LinkButton>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
