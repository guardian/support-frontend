import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import GridImage from 'components/gridImage/gridImage';
import HeroHeader from 'components/hero/HeroHeader';
import { PageTitle } from 'components/page/pageTitle';
import type { PromotionCopy } from 'helpers/productPrice/promotions';
import { promotionHTML } from 'helpers/productPrice/promotions';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import { getRegionalCopyFor } from './contentHelpers';

const pageTitleSpacing = css`
	padding-bottom: ${space[8]}px;
`;

export default function WeeklyDigitalHero({
	promotion,
	countryGroupId,
}: {
	promotion: PromotionCopy;
	countryGroupId: CountryGroupId;
}) {
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
				roundel={promotion.roundel ?? 'Save up to 35% a year'}
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
