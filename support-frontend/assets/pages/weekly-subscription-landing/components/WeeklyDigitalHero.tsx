import { css } from '@emotion/react';
import CentredContainer from 'components/containers/centredContainer';
import HeroContainer from 'components/hero/HeroContainer';
import HeroContent from 'components/hero/HeroContent';
import { WeeklyLandingPagePackShot } from 'components/packshots/weeklyPackshots';
import OfferStrapline from 'components/page/offerStrapline';
import { PageTitle } from 'components/page/pageTitle';
import {
	type PromotionCopy,
	promotionHTML,
} from 'helpers/productPrice/promotions';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import {
	pageTitleOverrides,
	roundelPromotionStyles,
	roundelStyles,
} from './weeklyDigitalHeroStyles';

export default function WeeklyDigitalHero({
	promotion,
}: {
	promotion: PromotionCopy;
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
			cssOverrides={pageTitleOverrides}
		>
			<CentredContainer>
				{roundel}
				<HeroContainer
					imageSlot={<WeeklyLandingPagePackShot />}
					contentSlot={
						<HeroContent
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
						/>
					}
				/>
			</CentredContainer>
		</PageTitle>
	);
}
