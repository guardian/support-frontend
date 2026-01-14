import { SvgInfoRound } from '@guardian/source/react-components';
import type { PaperFulfilmentOptions } from '@modules/product/fulfilmentOptions';
import { HomeDelivery } from '@modules/product/fulfilmentOptions';
import { observerLinks } from 'helpers/legal';
import type { ActivePaperProductOptions } from 'helpers/productCatalogToProductOption';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import type { PaperPromotion } from '../helpers/getPromotions';
import { productInfoWrapper } from './PaperLandingTsAndCsStyles';
import PaperPromotionExpiries from './PaperPromotionExpiries';

type PaperLandingTsAndCsProps = {
	paperFulfilment: PaperFulfilmentOptions;
	productPrices: ProductPrices;
	activePaperProducts: ActivePaperProductOptions[];
	paperPromotions?: PaperPromotion[];
};
export default function PaperLandingTsAndCs({
	paperFulfilment,
	paperPromotions,
}: PaperLandingTsAndCsProps): JSX.Element {
	const paperPromosWithExpiry = paperPromotions?.filter(
		(paperPromotion) => paperPromotion.expires,
	);
	return (
		<>
			<div css={productInfoWrapper}>
				<SvgInfoRound size="medium" />
				<p>
					{paperFulfilment === HomeDelivery && 'Delivery is included. '}
					You can cancel your subscription at any time. Sunday only
					subscriptions for The Observer are offered by Tortoise Media Ltd.
					Tortoise Media's{' '}
					<a href={observerLinks.TERMS}>terms and conditions</a> and{' '}
					<a href={observerLinks.PRIVACY}>privacy policy</a> will apply.
				</p>
			</div>
			{paperPromosWithExpiry && paperPromosWithExpiry.length > 0 && (
				<PaperPromotionExpiries paperPromotions={paperPromosWithExpiry} />
			)}
		</>
	);
}
