import { css } from '@emotion/react';
import {
	body,
	brandAlt,
	from,
	headline,
	space,
} from '@guardian/source-foundations';
import GridImage from 'components/gridImage/gridImage';
import Hero from 'components/page/hero';
import type { PromotionCopy } from 'helpers/productPrice/promotions';
import { promotionHTML } from 'helpers/productPrice/promotions';

interface PaperProductInfoProps {
	promotionCopy: PromotionCopy;
}

const heroCopy = css`
	padding: 0 ${space[3]}px ${space[3]}px;
	${from.tablet} {
		padding-bottom: ${space[9]}px;
	}
	${from.desktop} {
		padding-bottom: ${space[24]}px;
	}
`;
const heroTitle = css`
	${headline.medium({
		fontWeight: 'bold',
	})};
	margin-bottom: ${space[3]}px;

	${from.tablet} {
		${headline.large({
			fontWeight: 'bold',
		})};
	}
`;
const heroTitleHighlight = css`
	color: ${brandAlt[400]};
`;
const heroParagraph = css`
	${body.medium({
		lineHeight: 'loose',
	})}
	margin-bottom: ${space[6]}px;

	/* apply the same margin to paragraphs parsed from markdown from promo codes */
	& p:not(:last-of-type) {
		margin-bottom: ${space[9]}px;
	}

	${from.desktop} {
		max-width: 75%;
		margin-bottom: ${space[9]}px;
	}
`;
const mobileLineBreak = css`
	${from.tablet} {
		display: none;
	}
`;
const tabletLineBreak = css`
	${from.desktop} {
		display: none;
	}
`;
const defaultTitle = (
	<>
		Guardian <br css={mobileLineBreak} />
		and&nbsp;Observer <br css={mobileLineBreak} />
		newspaper subscriptions <br css={tabletLineBreak} />
		<span css={heroTitleHighlight}>to suit every reader</span>
	</>
);
const defaultCopy = (
	<>
		We offer a range of packages from every day to weekend, and different
		subscription types depending on whether you want to collect your newspaper
		in a shop or get it delivered.
	</>
);

export function PaperProductInfo({
	promotionCopy,
}: PaperProductInfoProps): JSX.Element {
	const title = promotionCopy.title ?? defaultTitle;
	const copy =
		promotionHTML(promotionCopy.description, {
			tag: 'p',
		}) ?? defaultCopy;
	return (
		<Hero
			image={
				<GridImage
					gridId="printCampaignHeroHD"
					srcSizes={[1000, 500, 140]}
					sizes="(max-width: 740px) 100%,
            (max-width: 1067px) 150%,
            500px"
					imgType="png"
					altText="Newspapers"
				/>
			}
			hideRoundelBelow="mobileMedium"
			roundelElement={undefined}
		>
			<section css={heroCopy}>
				<h2 css={heroTitle}>{title}</h2>
				<p css={heroParagraph}>{copy}</p>
			</section>
		</Hero>
	);
}
