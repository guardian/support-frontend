import { css } from '@emotion/react';
import {
	from,
	palette,
	space,
	textSansBold17,
} from '@guardian/source/foundations';
import GridPicture from 'components/gridPicture/gridPicture';
import HeroHeader from 'components/hero/HeroHeader';
import OfferStrapline from 'components/page/offerStrapline';
import { PageTitle } from 'components/page/pageTitle';
import {
	type PromotionCopy,
	promotionHTML,
} from 'helpers/productPrice/promotions';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';

const pageTitleSpacing = css`
	${from.tablet} {
		padding-bottom: ${space[8]}px;
	}
	p {
		${from.desktop} {
			max-width: 100%;
		}
	}
`;

const roundelStyles = css`
	${textSansBold17}
`;
const roundelPromotionStyles = css`
	background-color: ${palette.lifestyle[400]};
	color: ${palette.neutral[100]};
`;

export default function WeeklyDigitalHero({
	promotion,
	enableWeeklyDigital,
}: {
	promotion: PromotionCopy;
	enableWeeklyDigital: boolean;
}) {
	const {
		roundel: promotionRoundel,
		title: promotionTitle,
		description: promotionDescription,
	} = promotion;

	const defaultRoundel = 'Includes unlimited digital access';
	const defaultTitle = 'A week in the life of the world';
	const defaultDescription = `
			Discover our global print magazine, showcasing the best of our reporting,
			analysis, opinion and culture—beautifully designed for a more reflective
			read. With your subscription, you also get full digital access, including
			ad-free news, thousands of Feast recipes and more, all while supporting
			the Guardian’s independent journalism.`;

	// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- Using || as we need to treat empty strings as falsy values here
	const title = promotionTitle || defaultTitle;
	const description =
		promotionHTML(promotionDescription, {
			tag: 'p',
		}) ?? defaultDescription;

	const roundel = (
		<OfferStrapline
			copy={promotionRoundel ?? defaultRoundel}
			cssOverrides={[
				roundelStyles,
				promotionRoundel ? roundelPromotionStyles : css``,
			]}
		/>
	);

	return (
		<PageTitle
			title="The Guardian Weekly"
			theme="weekly"
			cssOverrides={pageTitleSpacing}
			enableWeeklyDigital={enableWeeklyDigital}
		>
			<HeroHeader
				heroImage={
					<>
						<GridPicture
							sources={[
								{
									gridId: `weeklyDigitalLandingHeroMobile_16x9`,
									srcSizes: [2000],
									sizes: '331px',
									imgType: 'png',
									media: '(max-width: 739px)',
								},
								{
									gridId: `weeklyDigitalLandingHeroTablet_1x1`,
									srcSizes: [2000],
									sizes: '340px',
									imgType: 'png',
									media: '(max-width: 979px)',
								},
								{
									gridId: `weeklyDigitalLandingHeroDesktop_4x3`,
									srcSizes: [2000],
									sizes: '435px',
									imgType: 'png',
									media: '(min-width: 980px)',
								},
							]}
							fallback={`weeklyDigitalLandingHeroDesktop_4x3`}
							fallbackSize={2000}
							altText="A collection of Guardian Weekly magazines"
						/>
					</>
				}
				roundel={roundel}
				title={title}
				description={description}
				ctaText="See pricing options"
				ctaLink="#subscribe"
				onClick={() =>
					sendTrackingEventsOnClick({
						id: 'options_cta_click',
						product: 'GuardianWeekly',
						componentType: 'ACQUISITIONS_BUTTON',
					})
				}
				enableWeeklyDigital={enableWeeklyDigital}
			/>
		</PageTitle>
	);
}
