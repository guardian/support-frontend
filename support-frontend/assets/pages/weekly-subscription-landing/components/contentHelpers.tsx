import type { PromotionCopy } from 'helpers/productPrice/promotions';
import { promotionHTML } from 'helpers/productPrice/promotions';

export const getFirstParagraph = (
	promotionCopy: PromotionCopy,
): JSX.Element | null => {
	if (promotionCopy.description) {
		return promotionHTML(promotionCopy.description, {
			tag: 'p',
		});
	}
	return (
		<>
			<p>
				Gift the Guardian Weekly magazine to someone today, so they can gain a
				deeper understanding of the issues they care about. They’ll find
				in-depth reporting, alongside news, opinion pieces and long reads from
				around the globe. From unpicking the election results to debunking
				climate misinformation, they can take time with the Guardian Weekly to
				help them make sense of the world.
			</p>
		</>
	);
};
