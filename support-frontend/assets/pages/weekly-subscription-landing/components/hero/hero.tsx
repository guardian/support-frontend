// ----- Imports ----- //

import { css, ThemeProvider } from '@emotion/react';
import {
	body,
	brandAlt,
	from,
	headline,
	palette,
	space,
} from '@guardian/source-foundations';
import {
	buttonThemeDefault,
	LinkButton,
	SvgArrowDownStraight,
} from '@guardian/source-react-components';
import CentredContainer from 'components/containers/centredContainer';
import GridImage from 'components/gridImage/gridImage';
import Hero from 'components/page/hero';
import OfferStrapline from 'components/page/offerStrapline';
import PageTitle from 'components/page/pageTitle';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import {
	detect,
	GBPCountries,
} from 'helpers/internationalisation/countryGroup';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { promotionHTML } from 'helpers/productPrice/promotions';
import type { PromotionCopy } from 'helpers/productPrice/promotions';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import { guardianWeeklyHeroBlue } from 'stylesheets/emotion/colours';
import WeeklyProductPrices from '../weeklyProductPrices';

type WeeklyHeroPropTypes = {
	orderIsAGift: boolean;
	promotionCopy: PromotionCopy;
};

type PriceCardsWeeklyHeroPropTypes = {
	orderIsAGift: boolean;
	promotionCopy: PromotionCopy;
	countryId: IsoCountry;
	productPrices: ProductPrices;
	isPriceCardsAbTestVariant: boolean;
};

const styles = {
	weeklyHeroCopy: css`
		padding: 0 ${space[3]}px ${space[3]}px;
		color: ${palette.neutral[7]};
	`,
	weeklyHeroTitle: css`
		${headline.small({
			fontWeight: 'bold',
		})};
		margin-bottom: ${space[3]}px;

		${from.mobileLandscape} {
			width: 75%;
		}

		${from.tablet} {
			${headline.large({
				fontWeight: 'bold',
			})};
			width: 100%;
		}
	`,
	pageTitleOverrides: css`
		width: 100%;
	`,
	weeklyHeroParagraph: css`
		${body.medium({
			lineHeight: 'loose',
		})}
		margin-bottom: ${space[9]}px;

		/* apply the same margin to paragraphs parsed from markdown from promo codes */
		& p:not(:last-of-type) {
			margin-bottom: ${space[9]}px;
		}
	`,
	showOnMobile: css`
		display: block;

		${from.mobileLandscape} {
			display: none;
		}
	`,
	priceCardsHeroContainer: css`
		background-color: ${palette.brand[400]};
	`,
};

export const getRegionalCopyFor = (region: CountryGroupId): JSX.Element =>
	region === GBPCountries ? (
		<span>
			Find clarity
			<br css={styles.showOnMobile} /> with the Guardian&apos;s global magazine
		</span>
	) : (
		<span>
			Read The
			<br css={styles.showOnMobile} /> Guardian in print
		</span>
	);

export const getFirstParagraph = (
	promotionCopy: PromotionCopy,
	orderIsAGift: boolean,
): JSX.Element | null => {
	if (promotionCopy.description) {
		return promotionHTML(promotionCopy.description);
	}

	if (orderIsAGift) {
		return (
			<>
				<p>
					Gift the Guardian Weekly magazine to someone today, so they can gain a
					deeper understanding of the issues they care about. They’ll find
					in-depth reporting, alongside news, opinion pieces and long reads from
					around the globe. From unpicking the election results to debunking
					climate misinformation, they can take time with the Guardian Weekly to
					help them make sense of the world.
				</p>
			</>
		);
	}

	return (
		<>
			The Guardian Weekly takes you beyond the headlines to give you a deeper
			understanding of the issues that really matter. Inside you’ll find the
			week’s most memorable stories brought to life with striking photography.
			Featuring a roundup of global news, opinion and long reads, all handpicked
			from the Guardian and Observer.
		</>
	);
};

export function WeeklyHero({
	orderIsAGift,
	promotionCopy,
}: WeeklyHeroPropTypes): JSX.Element {
	const defaultRoundelText = 'Save up to 35% a year';
	const defaultTitle = orderIsAGift ? null : getRegionalCopyFor(detect());
	const title = promotionCopy.title ?? defaultTitle;
	const copy = getFirstParagraph(promotionCopy, orderIsAGift);
	const roundelText = promotionCopy.roundel ?? defaultRoundelText;
	const containerColour = css`
		background-color: ${guardianWeeklyHeroBlue};
	`;
	const linkButtonColour = css`
		color: ${palette.neutral[7]};
		&:hover {
			background: ${'#AEBDC8'};
		}
	`;

	return (
		<PageTitle
			title={orderIsAGift ? 'Give the Guardian Weekly' : 'The Guardian Weekly'}
		>
			<CentredContainer>
				<OfferStrapline
					fgCol={palette.neutral[7]}
					bgCol={brandAlt[400]}
					copy={roundelText}
					orderIsAGift={orderIsAGift}
				/>
				<Hero
					image={
						<GridImage
							gridId="weeklyCampaignHeroImg"
							srcSizes={[1000, 500, 140]}
							sizes="(max-width: 740px) 100%,
            (max-width: 1067px) 150%,
            500px"
							imgType="png"
							altText="A collection of Guardian Weekly magazines"
						/>
					}
					roundelText={undefined}
					cssOverrides={containerColour}
				>
					<section css={styles.weeklyHeroCopy}>
						<h2 css={styles.weeklyHeroTitle}>{title}</h2>
						<p css={styles.weeklyHeroParagraph}>{copy}</p>
						<ThemeProvider theme={buttonThemeDefault}>
							<LinkButton
								onClick={sendTrackingEventsOnClick({
									id: 'options_cta_click',
									product: 'GuardianWeekly',
									componentType: 'ACQUISITIONS_BUTTON',
								})}
								priority="tertiary"
								iconSide="right"
								icon={<SvgArrowDownStraight />}
								cssOverrides={linkButtonColour}
								href="#subscribe"
							>
								See pricing options
							</LinkButton>
						</ThemeProvider>
					</section>
				</Hero>
			</CentredContainer>
		</PageTitle>
	);
}

export function PriceCardsWeeklyHero({
	orderIsAGift,
	promotionCopy,
	countryId,
	productPrices,
	isPriceCardsAbTestVariant,
}: PriceCardsWeeklyHeroPropTypes): JSX.Element {
	const defaultRoundelText = 'Save up to 35% a year';
	const roundelText = promotionCopy.roundel ?? defaultRoundelText;

	return (
		<PageTitle
			title={orderIsAGift ? 'Give the Guardian Weekly' : 'The Guardian Weekly'}
			cssOverrides={styles.pageTitleOverrides}
		>
			<CentredContainer>
				<OfferStrapline
					fgCol={palette.neutral[7]}
					bgCol={brandAlt[400]}
					copy={roundelText}
					orderIsAGift={orderIsAGift}
				/>
			</CentredContainer>
			<div css={styles.priceCardsHeroContainer}>
				<CentredContainer>
					<WeeklyProductPrices
						countryId={countryId}
						productPrices={productPrices}
						orderIsAGift={orderIsAGift}
						isPriceCardsAbTestVariant={isPriceCardsAbTestVariant}
					/>
				</CentredContainer>
			</div>
		</PageTitle>
	);
}
