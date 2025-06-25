import { css } from '@emotion/react';
import {
	LinkButton,
	SvgInfoRound,
	themeButtonReaderRevenueBrand,
} from '@guardian/source/react-components';
import { BillingPeriod } from '@modules/product/billingPeriod';
import { useEffect } from 'react';
import { useHasBeenSeen } from 'helpers/customHooks/useHasBeenSeen';
import { useWindowWidth } from 'pages/aus-moment-map/hooks/useWindowWidth';
import { Channel } from 'pages/paper-subscription-landing/helpers/products';
import BenefitsList from '../../../components/product/BenefitsList';
import Collapsible from '../../../components/product/Collapsible';
import { type Product } from '../../../components/product/productOption';
import {
	ButtonCTA,
	card,
	cardHeader,
	cardHeading,
	cardInfo,
	cardLabel,
	cardOffer,
	cardPrice,
	cardWithLabel,
	planDescription,
	productLabel,
	productLabelObserver,
	specialOffer,
} from './NewspaperRatePlanCardStyles';

function NewspaperRatePlanCard(props: Product) {
	const [hasBeenSeen, setElementToObserve] = useHasBeenSeen({
		threshold: 0.5,
		debounce: true,
	});

	const { windowWidthIsGreaterThan } = useWindowWidth();

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
				<p css={cardInfo}>
					<SvgInfoRound size="xsmall" />
					Only available inside Greater London.
				</p>
			)}
		</>
	);

	return (
		<div
			ref={setElementToObserve}
			css={[
				card,
				props.cssOverrides,
				props.isSpecialOffer && specialOffer,
				props.label && cardWithLabel,
			]}
		>
			{props.label && <div css={cardLabel}>{props.label}</div>}
			<section css={cardHeader}>
				<h3 css={cardHeading}>{props.title}</h3>
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

			<p css={cardPrice}>
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

			<p css={cardOffer}>{props.offerCopy}</p>
			<p css={planDescription}>{props.planData?.description}</p>

			{windowWidthIsGreaterThan('tablet') ? (
				renderPlanDetails()
			) : (
				<Collapsible>{renderPlanDetails()}</Collapsible>
			)}
		</div>
	);
}

NewspaperRatePlanCard.defaultProps = {
	children: null,
	label: '',
	offerCopy: '',
	cssOverrides: '',
	billingPeriod: BillingPeriod.Monthly,
};

export default NewspaperRatePlanCard;
