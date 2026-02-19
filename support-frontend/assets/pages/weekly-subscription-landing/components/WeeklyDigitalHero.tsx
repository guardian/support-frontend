import { css } from '@emotion/react';
import { space, textSansBold17 } from '@guardian/source/foundations';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import GridImage from 'components/gridImage/gridImage';
import HeroHeader from 'components/hero/HeroHeader';
import OfferStrapline from 'components/page/offerStrapline';
import { PageTitle } from 'components/page/pageTitle';
import type { PromotionCopy } from 'helpers/productPrice/promotions';
import { promotionHTML } from 'helpers/productPrice/promotions';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import { getRegionalCopyFor } from './contentHelpers';

const pageTitleSpacing = css`
	padding-bottom: ${space[8]}px;
`;

export const roundelStyles = css`
	${textSansBold17}
`;

export default function WeeklyDigitalHero({
	promotion,
	countryGroupId,
}: {
	promotion: PromotionCopy;
	countryGroupId: CountryGroupId;
}) {
	const roundel = promotion.roundel ?? 'Save up to 35% a year';

	return (
		<PageTitle
			title="The Guardian Weekly"
			theme="weekly"
			cssOverrides={pageTitleSpacing}
		>
			<HeroHeader
				heroImage={
					<GridImage
						gridId="weeklyCampaignHeroImg"
						srcSizes={[500, 140]}
						sizes="(max-width: 740px) 100%, 500px"
						imgType="png"
						altText="A collection of Guardian Weekly magazines"
					/>
				}
				roundel={<OfferStrapline copy={roundel} cssOverrides={roundelStyles} />}
				title={promotion.title ?? getRegionalCopyFor(countryGroupId)}
				description={promotionHTML(promotion.description) ?? undefined}
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
		</PageTitle>
	);
}
