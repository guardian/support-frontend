import { SvgInfoRound } from '@guardian/source/react-components';
import type { PaperFulfilmentOptions } from '@modules/product/fulfilmentOptions';
import { HomeDelivery } from '@modules/product/fulfilmentOptions';
import { observerLinks } from 'helpers/legal';
import type { ActivePaperProductOptions } from 'helpers/productCatalogToProductOption';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { productInfoWrapper } from './PaperLandingTsAndCsStyles';
import PrintPromotionTsAndCs from './PrintPromotionTsAndCs';

export default function PaperLandingTsAndCs({
	paperFulfilment,
	productPrices,
	activePaperProducts,
}: {
	paperFulfilment: PaperFulfilmentOptions;
	productPrices: ProductPrices;
	activePaperProducts: ActivePaperProductOptions[];
}): JSX.Element {
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
			<PrintPromotionTsAndCs
				country={'GB'}
				paperFulfilment={paperFulfilment}
				productPrices={productPrices}
				activePaperProducts={activePaperProducts}
			/>
		</>
	);
}
