import { getMaxSavingVsRetail } from 'helpers/productPrice/paperSavingsVsRetail';
import type { ProductPrices } from 'helpers/productPrice/productPrices';

export type PaperHeroItems = {
	titleCopy: string | JSX.Element;
	bodyCopy: string;
	roundelCopy: string | undefined;
};

const roundelPaperPlus = 'Includes unlimited digital access';
const bodyPaperPlus = `From political insight to the perfect pasta, there’s something for everyone
		with a Guardian print subscription. Plus, unlock the full digital experience when you subscribe, so you can stay informed on your mobile or tablet, wherever you
		are, whenever you like.`;

function titlePaperPlus(productPrices: ProductPrices): string {
	return `Save up to ${
		getMaxSavingVsRetail(productPrices) ?? 0
	}% with a Guardian print subscription`;
}

export function getPaperPlusItems(
	productPrices: ProductPrices,
): PaperHeroItems {
	return {
		titleCopy: titlePaperPlus(productPrices),
		bodyCopy: bodyPaperPlus,
		roundelCopy: roundelPaperPlus,
	};
}
