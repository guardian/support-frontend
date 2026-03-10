import {
	LinkButton,
	themeButtonReaderRevenue,
} from '@guardian/source/react-components';
import { useEffect } from 'react';
import type { Product } from 'components/product/productOption';
import { usePromoTerms } from 'contexts/PromoTermsContext';
import { useHasBeenSeen } from 'helpers/customHooks/useHasBeenSeen';
import getWeeklyPromoTerms from '../helpers/getWeeklyPromoTerms';
import {
	ButtonCTA,
	card,
	cardHeading,
	cardLabel,
	cardPrice,
	cardWithLabel,
	discountSummaryStyle,
	roundelPromotionStyles,
	savingsTextStyle,
	strikethroughPriceStyle,
} from './WeeklyRatePlanCardStyles';

function WeeklyRatePlanCard(
	ratePlan: Product & { somePriorityPromotion: boolean },
) {
	const {
		title,
		price,
		discountedPrice,
		billingPeriodNoun,
		billingPeriod,
		discountSummary,
		savingsText,
		roundel,
		hasPromotion,
		isPriorityPromo,
		href,
		onClick,
		onView,
		somePriorityPromotion,
	} = ratePlan;
	const [hasBeenSeen, setElementToObserve] = useHasBeenSeen({
		threshold: 0.5,
		debounce: true,
	});

	const displayRoundel =
		(isPriorityPromo && somePriorityPromotion) ??
		(!somePriorityPromotion && !isPriorityPromo && hasPromotion);

	/**
	 * The first time this runs hasBeenSeen
	 * is false, it's default value. It will run
	 * once more if the element under observation
	 * has scrolled into view, then hasBeenSeen should be
	 * true.
	 * */
	useEffect(() => {
		hasBeenSeen && onView();
	}, [hasBeenSeen]);

	useEffect(() => {
		const { setPromoTerms } = usePromoTerms();
		if (hasPromotion && billingPeriod && discountedPrice) {
			const promoTerms = getWeeklyPromoTerms(
				billingPeriod,
				price,
				discountedPrice,
			);
			setPromoTerms(promoTerms);
		}
	}, [hasPromotion, billingPeriod, discountedPrice]);

	return (
		<div
			ref={setElementToObserve}
			css={[card, displayRoundel && cardWithLabel]}
		>
			{displayRoundel && (
				<div css={[cardLabel, isPriorityPromo && roundelPromotionStyles]}>
					{roundel}
				</div>
			)}
			<section>
				<h3 css={cardHeading}>{title}</h3>
				<p css={cardPrice}>
					{discountedPrice ? (
						<>
							<span css={strikethroughPriceStyle}>{price}</span>
							{discountedPrice}
						</>
					) : (
						price
					)}
					<small>/{billingPeriodNoun}</small>
				</p>
				{savingsText && <p css={savingsTextStyle}>{savingsText}</p>}
			</section>
			<div css={ButtonCTA}>
				<LinkButton
					href={href}
					onClick={onClick}
					aria-label={`subscribe ${title}`}
					theme={themeButtonReaderRevenue}
				>
					Subscribe now
				</LinkButton>
			</div>
			{discountSummary && <p css={discountSummaryStyle}>{discountSummary}</p>}
		</div>
	);
}

export default WeeklyRatePlanCard;
