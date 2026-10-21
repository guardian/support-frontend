import { usePromoTerms } from 'contexts/PromoTermsContext';
import { promotionContainer } from './PaperPromotionExpiriesStyles';

export default function PaperPromotionExpiries(): JSX.Element | null {
	const { promoTerms } = usePromoTerms();

	if (promoTerms.length === 0) {
		return null;
	}

	return (
		<div css={promotionContainer}>
			{promoTerms.map(({ promoCode, description }) => (
				<p key={promoCode}>{description}</p>
			))}
		</div>
	);
}
