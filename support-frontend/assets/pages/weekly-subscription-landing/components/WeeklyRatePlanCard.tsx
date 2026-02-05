import { css } from '@emotion/react';
import {
	from,
	headlineBold24,
	headlineBold34,
	headlineLight34,
	palette,
	space,
	textSans12,
	textSans15,
} from '@guardian/source/foundations';
import {
	LinkButton,
	themeButtonReaderRevenue,
} from '@guardian/source/react-components';
import { useEffect } from 'react';
import type { Product } from 'components/product/productOption';
import { useHasBeenSeen } from 'helpers/customHooks/useHasBeenSeen';

const card = css`
	background-color: ${palette.neutral[100]};
	color: ${palette.neutral[7]};
	padding: ${space[3]}px ${space[4]}px ${space[5]}px;
	border-radius: ${space[2]}px;
	flex: 1;
`;

export const cardHeading = css`
	${headlineBold24};
	margin-bottom: ${space[2]}px;
`;

export const cardPrice = css`
	${headlineBold34};
	margin-top: ${space[2]}px;
	small {
		${textSans15};
	}
`;

export const strikethroughPriceStyle = css`
	${headlineLight34}
	text-decoration-line: line-through;
	text-decoration-thickness: 1px;
	margin-right: ${space[2]}px;
`;

export const savingsTextStyle = css`
	${textSans15};
	margin-top: 2px;
	${from.tablet} {
		min-height: 24px;
	}
`;

export const cardOffer = css`
	${textSans12};
	margin-top: ${space[2]}px;
	color: ${palette.neutral[38]};
	text-align: center;
	${from.tablet} {
		min-height: 20px;
	}
`;

export const ButtonCTA = css`
	display: flex;
	flex-direction: column;
	align-items: stretch;
	margin: ${space[5]}px 0 ${space[2]}px;
`;

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
