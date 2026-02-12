import {
	LinkButton,
	themeButtonReaderRevenue,
} from '@guardian/source/react-components';
import { useEffect } from 'react';
import type { Product } from 'components/product/productOption';
import { useHasBeenSeen } from 'helpers/customHooks/useHasBeenSeen';
import {
	ButtonCTA,
	card,
	cardHeading,
	cardLabel,
	cardPrice,
	cardWithLabel,
	discountSummaryStyle,
	savingsTextStyle,
	strikethroughPriceStyle,
} from './WeeklyRatePlanCardStyles';

function WeeklyRatePlanCard(product: Product) {
	const {
		title,
		price,
		discountedPrice,
		billingPeriodNoun,
		discountSummary,
		savingsText,
		showLabel,
		href,
		onClick,
		onView,
	} = product;
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

	return (
		<div ref={setElementToObserve} css={[card, showLabel && cardWithLabel]}>
			{showLabel && <div css={cardLabel}>Best deal</div>}
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
