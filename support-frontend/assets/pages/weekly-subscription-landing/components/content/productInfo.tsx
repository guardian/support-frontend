import { css } from '@emotion/react';
import {
	body,
	from,
	headline,
	palette,
	space,
} from '@guardian/source-foundations';
import GridImage from 'components/gridImage/gridImage';
import Hero from 'components/page/hero';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import {
	detect,
	GBPCountries,
} from 'helpers/internationalisation/countryGroup';
import type { PromotionCopy } from 'helpers/productPrice/promotions';
import { promotionHTML } from 'helpers/productPrice/promotions';

interface ProductInfoProps {
	promotionCopy: PromotionCopy;
	orderIsAGift: boolean;
}

const styles = {
	heroOverrides: css`
		background-color: #cadbe8;
	`,
	showOnMobile: css`
		display: block;

		${from.mobileLandscape} {
			display: none;
		}
	`,
	productCopy: css`
		padding: 0 ${space[3]}px ${space[3]}px;
		color: ${palette.neutral[7]};
	`,
	productTitle: css`
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
	productParagraph: css`
		${body.medium({
			lineHeight: 'loose',
		})}
		margin-bottom: ${space[9]}px;

		/* apply the same margin to paragraphs parsed from markdown from promo codes */
		& p:not(:last-of-type) {
			margin-bottom: ${space[9]}px;
		}
	`,
};

const getRegionalCopyFor = (region: CountryGroupId) =>
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

const getFirstParagraph = (
	promotionCopy: PromotionCopy,
	orderIsAGift: boolean,
) => {
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

function ProductInfo({
	promotionCopy,
	orderIsAGift,
}: ProductInfoProps): JSX.Element {
	const defaultTitle = orderIsAGift ? null : getRegionalCopyFor(detect());
	const title = promotionCopy.title ?? defaultTitle;
	const copy = getFirstParagraph(promotionCopy, orderIsAGift);

	return (
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
			cssOverrides={styles.heroOverrides}
		>
			<section css={styles.productCopy}>
				<h2 css={styles.productTitle}>{title}</h2>
				<p css={styles.productParagraph}>{copy}</p>
			</section>
		</Hero>
	);
}

export default ProductInfo;
