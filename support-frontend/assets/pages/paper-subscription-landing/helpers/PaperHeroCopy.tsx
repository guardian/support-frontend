import { getMaxSavingVsRetail } from 'helpers/productPrice/paperSavingsVsRetail';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import type { Option } from 'helpers/types/option';
import { desktopToWideLineBreak } from '../components/content/PaperHeroStyles';

export type PaperHeroItems = {
	titleCopy: string | JSX.Element;
	bodyCopy: string;
	roundelCopy: string | undefined;
};

type DiscountCopy = {
	roundel: string[];
	heading: Option<string>;
};

export function getPaperPlusItems(
	productPrices: ProductPrices,
): PaperHeroItems {
	return {
		titleCopy: titlePaperPlus(productPrices),
		bodyCopy: bodyPaperPlus,
		roundelCopy: roundelPaperPlus,
	};
}
export function getPaperItems(productPrices: ProductPrices): PaperHeroItems {
	return {
		titleCopy: titlePaper,
		bodyCopy: bodyPaper,
		roundelCopy: roundelPaper(productPrices),
	};
}

const titlePaper = (
	<>
		Guardian and <br css={desktopToWideLineBreak} />
		Observer newspapers
	</>
);
function titlePaperPlus(productPrices: ProductPrices): string {
	return `Save up to ${
		getMaxSavingVsRetail(productPrices) ?? 0
	}% with a Guardian print subscription`;
}
function roundelPaper(productPrices: ProductPrices): string | undefined {
	const maxSavingVsRetail = getMaxSavingVsRetail(productPrices) ?? 0;
	const { roundel } = getDiscountCopy(maxSavingVsRetail);
	const roundelText = roundel.length ? roundel.join(' ') : undefined;
	return roundelText;
}
const roundelPaperPlus = 'Includes unlimited digital access';
const bodyPaper = `Whether you’re looking to keep up to date with the headlines or pore over
		our irresistible recipes, you can enjoy our award-winning journalism for
		less.`;
const bodyPaperPlus = `From political insight to the perfect pasta, there’s something for everyone
		with a Guardian print subscription. Plus, unlock the full digital experience when you subscribe, so you can stay informed on your mobile or tablet, wherever you
		are, whenever you like.`;

const getDiscountCopy = (discountPercentage: number): DiscountCopy =>
	discountPercentage > 0
		? {
				roundel: ['Save up to', `${discountPercentage}%`, 'a year'],
				heading: `Save up to ${discountPercentage}% a year with a subscription`,
		  }
		: {
				roundel: [],
				heading: 'Save money with a subscription',
		  };
