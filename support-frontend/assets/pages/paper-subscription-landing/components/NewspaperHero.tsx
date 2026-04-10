import CentredContainer from 'components/containers/centredContainer';
import HeroContainer from 'components/hero/HeroContainer';
import HeroContent from 'components/hero/HeroContent';
import PaperPackShot from 'components/packshots/paperPackshot';
import OfferStrapline from 'components/page/offerStrapline';
import { PageTitle } from 'components/page/pageTitle';
import type { PromotionCopy } from 'helpers/productPrice/promotions';
import { promotionHTML } from 'helpers/productPrice/promotions';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import type { PaperHeroItems } from '../helpers/PaperHeroCopy';

export default function NewspaperHero({
	paperHeroItems,
	promotionCopy,
}: {
	promotionCopy: PromotionCopy;
	paperHeroItems: PaperHeroItems;
}) {
	const {
		roundel: promotionRoundel,
		title,
		description: promotionDescription,
	} = promotionCopy;

	const {
		titleCopy: fallbackTitle,
		roundelCopy: fallbackRoundel,
		bodyCopy: fallbackDescription,
	} = paperHeroItems;

	const roundel = promotionRoundel ?? fallbackRoundel;
	const description = promotionHTML(promotionDescription, {
		tag: 'p',
	});

	const roundelComponent = roundel && <OfferStrapline copy={roundel} />;

	return (
		<PageTitle title="Newspaper subscription" theme="weekly">
			<CentredContainer>
				{roundelComponent}
				<HeroContainer
					imageSlot={<PaperPackShot />}
					imagePosition="bottom"
					contentSlot={
						<HeroContent
							title={title ?? fallbackTitle}
							description={description ?? fallbackDescription}
							ctaLink="#HomeDelivery"
							ctaText="See pricing options"
							onClick={sendTrackingEventsOnClick({
								id: 'options_cta_click',
								product: 'Paper',
								componentType: 'ACQUISITIONS_BUTTON',
							})}
						/>
					}
				/>
			</CentredContainer>
		</PageTitle>
	);
}
