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
	cardOffer,
	cardPrice,
	savingsTextStyle,
	strikethroughPriceStyle,
} from './WeeklyRatePlanCardStyles';

function WeeklyRatePlanCard(product: Product) {
	const {
		title,
		price,
		discountedPrice,
		billingPeriodNoun,
		priceCopy,
		offerCopy,
		href,
		onClick,
		onView,
		buttonCopy,
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
		<div ref={setElementToObserve} css={card}>
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
			<p css={savingsTextStyle}>{offerCopy}</p>
			<div css={ButtonCTA}>
				<LinkButton
					href={href}
					onClick={onClick}
					aria-label={`${title}- ${buttonCopy}`}
					theme={themeButtonReaderRevenue}
				>
					{buttonCopy}
				</LinkButton>
			</div>
			{priceCopy && <p css={cardOffer}>{priceCopy}</p>}
		</div>
	);
}

export default WeeklyRatePlanCard;
