import { css } from '@emotion/react';
import {
	LinkButton,
	SvgInfoRound,
	themeButtonReaderRevenueBrand,
} from '@guardian/source/react-components';
import { useEffect } from 'react';
import { useHasBeenSeen } from 'helpers/customHooks/useHasBeenSeen';
import { useWindowWidth } from 'pages/aus-moment-map/hooks/useWindowWidth';
import { Channel } from 'pages/paper-subscription-landing/helpers/products';
import BenefitsList from '../../../components/product/BenefitsList';
import Collapsible from '../../../components/product/Collapsible';
import { type Product } from '../../../components/product/productOption';
import {
	badge,
	badgeObserver,
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
	planDetailsContainer,
	planDetailsEndSection,
	sectionMarginZero,
} from './NewspaperRatePlanCardStyles';

function NewspaperRatePlanCard({
	title,
	price,
	planData,
	offerCopy,
	buttonCopy,
	href,
	onClick,
	onView,
	showLabel,
	productLabel,
	unavailableOutsideLondon,
}: Product) {
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
			onView();
		}
	}, [hasBeenSeen]);

	const isObserverChannel = productLabel?.channel === Channel.Observer;

	const renderPlanDetails = () => (
		<div
			css={[
				planDetailsContainer,
				!planData?.digitalRewards?.label && sectionMarginZero,
			]}
		>
			<BenefitsList
				title={planData?.benefits.label}
				listItems={planData?.benefits.items}
			/>
			<BenefitsList
				title={planData?.digitalRewards?.label}
				listItems={planData?.digitalRewards?.items}
			/>
			<div css={planDetailsEndSection}>
				{unavailableOutsideLondon && (
					<p css={cardInfo}>
						<SvgInfoRound size="xsmall" />
						Only available inside Greater London.
					</p>
				)}
			</div>
		</div>
	);

	return (
		<div ref={setElementToObserve} css={[card, showLabel && cardWithLabel]}>
			{showLabel && <div css={cardLabel}>Most popular</div>}
			<section css={cardHeader}>
				<h3 css={cardHeading}>{title}</h3>
				{productLabel && (
					<span css={[badge, isObserverChannel ? badgeObserver : css``]}>
						{productLabel.text}
					</span>
				)}
			</section>

			<p css={cardPrice}>
				{price}
				<small>/month</small>
			</p>

			<div css={ButtonCTA}>
				<LinkButton
					priority="primary"
					href={href}
					onClick={onClick}
					aria-label={`${title}- ${buttonCopy}`}
					theme={themeButtonReaderRevenueBrand}
				>
					{buttonCopy}
				</LinkButton>
			</div>

			<p css={cardOffer}>{offerCopy}</p>
			<p css={planDescription}>{planData?.description}</p>

			{windowWidthIsGreaterThan('tablet') ? (
				renderPlanDetails()
			) : (
				<Collapsible>{renderPlanDetails()}</Collapsible>
			)}
		</div>
	);
}

export default NewspaperRatePlanCard;
