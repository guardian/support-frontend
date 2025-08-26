import { css } from '@emotion/react';
import {
	LinkButton,
	SvgInfoRound,
	themeButtonReaderRevenueBrand,
} from '@guardian/source/react-components';
import type { PaperFulfilmentOptions } from '@modules/product/fulfilmentOptions';
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
	label,
	productLabel,
	unavailableOutsideLondon,
	fulfilmentOptions,
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

	function renderPlanDetails(
		fulfilmentOptions: PaperFulfilmentOptions | undefined,
	) {
		return (
			<>
				{fulfilmentOptions && (
					<>
						<BenefitsList
							title={planData?.benefits.label[fulfilmentOptions]}
							listItems={planData?.benefits.items}
						/>

						<BenefitsList
							title={planData?.digitalRewards?.label[fulfilmentOptions]}
							listItems={planData?.digitalRewards?.items}
						/>
						{unavailableOutsideLondon && (
							<p css={cardInfo}>
								<SvgInfoRound size="xsmall" />
								Only available inside Greater London.
							</p>
						)}
					</>
				)}
			</>
		);
	}

	return (
		<div ref={setElementToObserve} css={[card, label && cardWithLabel]}>
			{label && <div css={cardLabel}>{label}</div>}
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
				renderPlanDetails(fulfilmentOptions)
			) : (
				<Collapsible>{renderPlanDetails(fulfilmentOptions)}</Collapsible>
			)}
		</div>
	);
}

export default NewspaperRatePlanCard;
