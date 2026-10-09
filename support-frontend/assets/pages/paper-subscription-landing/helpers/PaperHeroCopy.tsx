import type { WindowProductCatalog } from 'helpers/globalsAndSwitches/window';
import { getMaxSavingVsRetail } from 'helpers/productPrice/paperSavingsVsRetail';

export type PaperHeroItems = {
	titleCopy: string | JSX.Element;
	bodyCopy: string;
	roundelCopy: string | undefined;
};

const roundelPaperPlus = 'Includes unlimited digital access';
const bodyPaperPlus = `From political insight to the perfect pasta, there’s something for everyone
		with a Guardian print subscription. Plus, unlock the full digital experience when you subscribe, so you can stay informed on your mobile or tablet, wherever you
		are, whenever you like.`;

function titlePaperPlus(productCatalog: WindowProductCatalog): string {
	return `Save up to ${Math.floor(
		getMaxSavingVsRetail(productCatalog),
	)}% with a Guardian print subscription`;
}

export function getPaperPlusItems(
	productCatalog: WindowProductCatalog,
): PaperHeroItems {
	return {
		titleCopy: titlePaperPlus(productCatalog),
		bodyCopy: bodyPaperPlus,
		roundelCopy: roundelPaperPlus,
	};
}
