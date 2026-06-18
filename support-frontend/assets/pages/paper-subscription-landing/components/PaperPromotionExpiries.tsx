import { usePromoTerms } from 'contexts/PromoTermsContext';
import { promotionContainer } from './PaperPromotionExpiriesStyles';

export default function PaperPromotionExpiries(): JSX.Element | null {
	const { promoTerms } = usePromoTerms();
	if (!promoTerms) {
		return null;
	}

	return (
		<div css={promotionContainer}>
			<p>{promoTerms}</p>
		</div>
	);
}
