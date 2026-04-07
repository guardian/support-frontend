import { usePromoTerms } from 'contexts/PromoTermsContext';
import { promotionContainer } from './PaperPromotionExpiriesStyles';

export default function PaperPromotionExpiries(): JSX.Element {
	const { promoTerms } = usePromoTerms();
	return (
		<div css={promotionContainer}>
			<p>{promoTerms}</p>
		</div>
	);
}
