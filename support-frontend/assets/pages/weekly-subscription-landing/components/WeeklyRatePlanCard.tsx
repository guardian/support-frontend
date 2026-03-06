import {
	LinkButton,
	themeButtonReaderRevenue,
} from '@guardian/source/react-components';
import { BillingPeriod } from '@modules/product/billingPeriod';
import { useEffect } from 'react';
import type { Product } from 'components/product/productOption';
import { usePromoTerms } from 'contexts/PromoTermsContext';
import { useHasBeenSeen } from 'helpers/customHooks/useHasBeenSeen';
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

function WeeklyRatePlanCard(ratePlan: Product) {
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
		href,
		onClick,
		onView,
	} = ratePlan;
	const [hasBeenSeen, setElementToObserve] = useHasBeenSeen({
		threshold: 0.5,
		debounce: true,
	});

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
		const promoTerm =
			billingPeriod === BillingPeriod.Quarterly
				? `Introductory offer for quarterly subscriptions is ${discountedPrice} for the first quarter, then ${price}/quarter afterwards unless you cancel. Offer only available to new subscribers who do not have an existing subscription with the Guardian Weekly. Offer ends 12th April 2026.`
				: null;
		if (hasPromotion) {
			setPromoTerms(promoTerm);
		}
	}, [hasPromotion]);

	return (
		<div ref={setElementToObserve} css={[card, roundel && cardWithLabel]}>
			{roundel && (
				<div css={[cardLabel, hasPromotion && roundelPromotionStyles]}>
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
