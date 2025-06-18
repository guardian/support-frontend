import { css } from '@emotion/react';
import {
	LinkButton,
	SvgInfoRound,
	themeButtonReaderRevenueBrand,
} from '@guardian/source/react-components';
import { useEffect } from 'react';
import { useHasBeenSeen } from 'helpers/customHooks/useHasBeenSeen';
import { useIsWideScreen } from 'helpers/customHooks/useIsWideScreen';
import { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import { Channel } from 'pages/paper-subscription-landing/helpers/products';
import BenefitsList from './BenefitsList';
import Collapsible from './Collapsible';
import {
	ButtonCTA,
	planDescription,
	productCard,
	productCardHeader,
	productCardHeading,
	productCardInfo,
	productCardLabel,
	productCardOffer,
	productCardPrice,
	productCardWithLabel,
	productLabel,
	productLabelObserver,
	specialOffer,
} from './PaperProductCardStyles';
import { type Product } from './productOption';

function ProductCard(props: Product) {
	const [hasBeenSeen, setElementToObserve] = useHasBeenSeen({
		threshold: 0.5,
		debounce: true,
	});

	const isWideScreen = useIsWideScreen();

	/**
	 * The first time this runs hasBeenSeen
	 * is false, it's default value. It will run
	 * once more if the element under observation
	 * has scrolled into view, then hasBeenSeen should be
	 * true.
	 * */
	useEffect(() => {
		if (hasBeenSeen) {
			props.onView();
		}
	}, [hasBeenSeen]);

	const isObserverChannel = props.productLabel?.channel === Channel.Observer;

	const renderPlanDetails = () => (
		<>
			<BenefitsList
				title={props.planData?.benefits.label}
				listItems={props.planData?.benefits.items}
			/>

			<BenefitsList
				title={props.planData?.digitalRewards?.label}
				listItems={props.planData?.digitalRewards?.items}
			/>
			{props.unavailableOutsideLondon && (
				<p css={productCardInfo}>
					<SvgInfoRound size="small" />
					Only available inside Greater London.
				</p>
			)}
		</>
	);

	return (
		<div
			ref={setElementToObserve}
			css={[
				productCard,
				props.cssOverrides,
				props.isSpecialOffer ? specialOffer : css``,
				props.label ? productCardWithLabel : css``,
			]}
		>
			{props.label && <div css={[productCardLabel]}>{props.label}</div>}
			<section css={[productCardHeader]}>
				<h3 css={productCardHeading}>{props.title}</h3>
				{props.productLabel && (
					<span
						css={[
							productLabel,
							isObserverChannel ? productLabelObserver : css``,
						]}
					>
						{props.productLabel.text}
					</span>
				)}
				{props.children && props.children}
			</section>

			<p css={productCardPrice}>
				{props.price}
				<small>/month</small>
			</p>

			<div css={ButtonCTA}>
				<LinkButton
					priority="primary"
					href={props.href}
					onClick={props.onClick}
					aria-label={`${props.title}- ${props.buttonCopy}`}
					theme={themeButtonReaderRevenueBrand}
				>
					{props.buttonCopy}
				</LinkButton>
			</div>

			<p css={[productCardOffer]}>{props.offerCopy}</p>
			<p css={planDescription}>{props.planData?.description}</p>

			{isWideScreen ? (
				renderPlanDetails()
			) : (
				<Collapsible>{renderPlanDetails()}</Collapsible>
			)}
		</div>
	);
}

ProductCard.defaultProps = {
	children: null,
	label: '',
	offerCopy: '',
	cssOverrides: '',
	billingPeriod: BillingPeriod.Monthly,
};

export default ProductCard;
