import type { ContributionType } from 'helpers/contributions';
import type { Promotion } from 'helpers/productPrice/promotions';
import type { CardContent } from 'pages/supporter-plus-landing/components/threeTierCard';
import type { TsAndCsProps } from 'pages/supporter-plus-landing/components/threeTierTsAndCs';
import { getTierPlanCost } from './getTierPlanCost';

export function getTierCardTsAndCs(
	tierCard: CardContent,
	contributionType: ContributionType,
	promotion?: Promotion,
): TsAndCsProps {
	return {
		title: tierCard.title,
		planCost: getTierPlanCost(tierCard.price, contributionType, promotion),
		starts: promotion?.starts ? new Date(promotion.starts) : undefined,
		expires: promotion?.expires ? new Date(promotion.expires) : undefined,
	};
}
