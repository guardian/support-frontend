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
	cardLegalCopy,
	cardOffer,
	cardPrice,
	cardWithLabel,
	planDescription,
	planDetailsContainer,
	planDetailsEndSection,
	savingsTextStyle,
} from './NewspaperRatePlanCardStyles';

function NewspaperRatePlanCard({
	title,
	price,
	savingsText,
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

	// If the digital rewards section has no label, then we combine the benefits into
	// a single list UI wise.
	const digitalRewardsHasLabel = planData?.digitalRewards?.label;

	const shouldShowEndSection =
		Boolean(unavailableOutsideLondon) || isObserverChannel;

	const renderPlanDetails = () => (
		<div css={[planDetailsContainer]}>
			{digitalRewardsHasLabel ? (
				<>
					<BenefitsList
						title={planData.benefits.label}
						listItems={planData.benefits.items}
					/>
					<BenefitsList
						title={planData.digitalRewards?.label}
						listItems={planData.digitalRewards?.items}
					/>
				</>
			) : (
				<BenefitsList
					title={planData?.benefits.label}
					listItems={[
						...(planData?.benefits.items ?? []),
						...(planData?.digitalRewards?.items ?? []),
					]}
				/>
			)}
			{shouldShowEndSection && (
				<div css={planDetailsEndSection}>
					{unavailableOutsideLondon && (
						<p css={cardInfo}>
							<SvgInfoRound size="xsmall" />
							Only available inside Greater London.
						</p>
					)}
					{isObserverChannel && (
						<p css={cardLegalCopy}>
							Note: this subscription is with Tortoise Media, the owner of The
							Observer. The Guardian manages delivery of Sunday only print
							subscriptions for Tortoise Media
						</p>
					)}
				</div>
			)}
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
				<p css={cardPrice}>
					{price}
					<small>/month</small>
				</p>
				{savingsText && <p css={savingsTextStyle}>{savingsText}</p>}
			</section>

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
				<p css={cardOffer}>{offerCopy}</p>
			</div>

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
