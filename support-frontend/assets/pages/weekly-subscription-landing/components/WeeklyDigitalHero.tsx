import { css } from '@emotion/react';
import {
	between,
	from,
	headlineBold28,
	space,
	textSansBold17,
	until,
} from '@guardian/source/foundations';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import GridImage from 'components/gridImage/gridImage';
import HeroHeader from 'components/hero/HeroHeader';
import OfferStrapline from 'components/page/offerStrapline';
import { PageTitle } from 'components/page/pageTitle';
import {
	type PromotionCopy,
	promotionHTML,
} from 'helpers/productPrice/promotions';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import { getRegionalTitle } from './contentHelpers';

const pageTitleSpacing = css`
	padding-bottom: ${space[8]}px;

	h2 {
		${from.desktop} {
			${headlineBold28};
		}
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

const imageContainerMobile = css`
	display: none;
	${until.tablet} {
		display: block;
	}
`;
const imageContainerTablet = css`
	display: none;
	${between.tablet.and.desktop} {
		display: block;
	}
`;
const imageContainerDesktop = css`
	display: none;
	${from.desktop} {
		display: block;
	}
`;

export default function WeeklyDigitalHero({
	promotion,
	countryGroupId,
	enableWeeklyDigital,
}: {
	promotion: PromotionCopy;
	countryGroupId: CountryGroupId;
	enableWeeklyDigital: boolean;
}) {
	const { roundel, title, description: promotionDescription } = promotion;

	const roundelComponent = roundel && (
		<OfferStrapline copy={roundel} cssOverrides={roundelStyles} />
	);

	const fallbackDescription = enableWeeklyDigital
		? 'Discover our global print magazine, showcasing the best of our reporting, analysis, opinion and culture—beautifully designed for a more reflective read. With your subscription, you also get full digital access, including ad-free news, thousands of Feast recipes and more, all while supporting the Guardian’s independent journalism.'
		: '';
	const description = promotionDescription
		? promotionHTML(promotionDescription, {
				tag: 'p',
		  })
		: fallbackDescription;
	const fallbackTitle = getRegionalTitle(countryGroupId, enableWeeklyDigital);

	return (
		<PageTitle
			title="The Guardian Weekly"
			theme="weekly"
			cssOverrides={pageTitleSpacing}
		>
			<HeroHeader
				heroImage={
					<>
						<div css={imageContainerMobile}>
							<GridImage
								gridId="weeklyDigitalLandingHeroMobile_16x9"
								srcSizes={[368]}
								sizes="368px"
								imgType="png"
								altText="A collection of Guardian Weekly magazines"
							/>
						</div>
						<div css={imageContainerTablet}>
							<GridImage
								gridId="weeklyDigitalLandingHeroTablet_1x1"
								srcSizes={[340]}
								sizes="340px"
								imgType="png"
								altText="A collection of Guardian Weekly magazines"
							/>
						</div>
						<div css={imageContainerDesktop}>
							<GridImage
								gridId="weeklyDigitalLandingHeroDesktop_5x3"
								srcSizes={[420]}
								sizes="420px"
								imgType="png"
								altText="A collection of Guardian Weekly magazines"
							/>
						</div>
					</>
				}
				roundel={roundelComponent}
				title={title ?? fallbackTitle}
				description={description ?? undefined}
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
