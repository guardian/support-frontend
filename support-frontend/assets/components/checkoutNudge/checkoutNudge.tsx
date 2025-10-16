import { css } from '@emotion/react';
import {
	from,
	headlineBold20,
	headlineBold24,
	neutral,
	palette,
	space,
	textSans15,
	textSans17,
	until,
} from '@guardian/source/foundations';
import {
	LinkButton,
	themeButtonReaderRevenueBrand,
} from '@guardian/source/react-components';
import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { useEffect } from 'react';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
import {
	trackComponentClick,
	trackComponentLoad,
} from 'helpers/tracking/behaviour';
import type { CheckoutNudgeSettings } from '../../helpers/abTests/checkoutNudgeAbTests';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
	ProductBenefit,
} from '../../helpers/productCatalog';
import { productCatalog } from '../../helpers/productCatalog';
import { getSupportRegionIdConfig } from '../../pages/supportRegionConfig';

const nudgeBoxOverrides = css`
	background-color: ${neutral[97]};
	border: none;
`;

const innerBoxOverrides = css`
	display: grid;
	padding: ${space[4]}px;

	${until.tablet} {
		padding: ${space[4]}px;
	}

	${from.tablet} {
		padding: ${space[4]}px;
	}

	${from.desktop} {
		padding: ${space[4]}px;
	}
`;

const headlineOverrides = css`
	color: ${palette.brand[500]};
	${headlineBold24};
`;

const bodyCopyOverrides = css`
	margin-top: ${space[2]}px;
	${textSans15};
	font-weight: 700;
`;

const nudgeButtonOverrides = css`
	margin-top: ${space[2]}px;
	${textSans17};
	font-weight: 700;
	width: 100%;
`;

export interface CheckoutNudgeProps {
	supportRegionId: SupportRegionId;
	heading: string;
	body?: string;
	benefits?: ProductBenefit[];
	product: ActiveProductKey;
	ratePlan: ActiveRatePlanKey;
	amount: number;
}

export function CheckoutNudge({
	supportRegionId,
	heading,
	body,
	product,
	ratePlan,
	amount,
}: CheckoutNudgeProps) {
	useEffect(() => {
		trackComponentLoad('checkoutNudge');
	}, []);

	const { currency } = getSupportRegionIdConfig(supportRegionId);

	if (!(ratePlan === 'Monthly' || ratePlan === 'Annual')) {
		// Only these rate plans are currently supported
		return null;
	}
	const ratePlanDescription = ratePlan === 'Monthly' ? 'month' : 'year';

	// TODO - different copy?
	const getButtonCopy = `Support us for ${
		currency.glyph
	}${amount.toString()}/${ratePlanDescription}`;

	const urlParams = new URLSearchParams({
		product,
		ratePlan,
		...(product === 'Contribution' ? { contribution: amount.toString() } : {}),
		fromNudge: 'true',
	});

	const buildCtaUrl = `checkout?${urlParams.toString()}`;

	return (
		<Box cssOverrides={nudgeBoxOverrides}>
			<BoxContents cssOverrides={innerBoxOverrides}>
				<h3 css={headlineOverrides}>{heading}</h3>
				{body && (
					<div css={bodyCopyOverrides}>
						<p>{body}</p>
					</div>
				)}
				<LinkButton
					id="id_checkoutNudge"
					cssOverrides={nudgeButtonOverrides}
					isLoading={false}
					theme={themeButtonReaderRevenueBrand}
					href={buildCtaUrl}
					onClick={() => {
						trackComponentClick('checkoutNudge');
					}}
				>
					{getButtonCopy}
				</LinkButton>
			</BoxContents>
		</Box>
	);
}

const thankYouBoxOverrides = css`
	background-color: ${neutral[97]};
	border: none;
`;
const innerThankYouBoxOverrides = css`
	margin-bottom: 0px;
	padding-bottom: 0px;

	${until.tablet} {
		padding: ${space[3]}px;
		padding-bottom: 0px;
		margin-bottom: 0px;
	}

	${from.tablet} {
		padding: ${space[3]}px;
		padding-bottom: 0px;
		margin-bottom: 0px;
	}

	${from.desktop} {
		padding: ${space[3]}px;
		padding-bottom: 0px;
		margin-bottom: 0px;
	}
`;

const nudgeThankYouBox = css`
	display: grid;
	grid-template:
		'heading	heading'
		'copy		image';

	${from.desktop} {
		grid-template:
			'heading	image'
			'copy		image';
	}
`;

const headingOverride = css`
	grid-area: heading;
	color: ${palette.brand[500]};
	${headlineBold20};
`;

const copyOverride = css`
	grid-area: copy;
	margin-top: ${space[2]}px;
	${textSans15};
	font-weight: 700;
	padding-bottom: ${space[3]}px;
`;

const imageOverride = css`
	grid-area: image;
	justify-self: end;
	align-self: end;
	margin-left: ${space[2]}px;
	margin-top: ${space[2]}px;
`;

export interface CheckoutNudgeThankYouProps {
	heading: string;
	body?: string;
}

export function CheckoutNudgeThankYou({
	heading,
	body,
}: CheckoutNudgeThankYouProps) {
	return (
		<Box cssOverrides={thankYouBoxOverrides}>
			<BoxContents cssOverrides={innerThankYouBoxOverrides}>
				<div css={nudgeThankYouBox}>
					<h3 css={headingOverride}>{heading}</h3>
					{body && <p css={copyOverride}>{body}</p>}
					<img
						css={imageOverride}
						width="116px"
						height="91px"
						src="https://media.guim.co.uk/313aafcd2a1b8fed178628ce346b517248d8692b/0_0_702_582/140.png"
						alt="An illustration of a man watering a plant which represents The Guardian - helping it to grow"
					/>
				</div>
			</BoxContents>
		</Box>
	);
}

/**
 * The CheckoutNudge component is used on the checkout components.
 * If the current product+ratePlan matches the nudge's `fromProduct` then the nudge is displayed.
 * If the current product+ratePlan matches the nudge's `toProduct` and the 'fromNudge' query param is present then the nudge thankyou is displayed.
 */

interface CheckoutNudgeSelectorProps {
	nudgeSettings: CheckoutNudgeSettings;
	currentProduct: ActiveProductKey;
	currentRatePlan: ActiveRatePlanKey;
	supportRegionId: SupportRegionId;
}

export function CheckoutNudgeSelector({
	nudgeSettings,
	currentProduct,
	currentRatePlan,
	supportRegionId,
}: CheckoutNudgeSelectorProps) {
	if (
		nudgeSettings.fromProduct.product === currentProduct &&
		nudgeSettings.fromProduct.ratePlan === currentRatePlan
	) {
		// Show the nudge
		const { nudgeToProduct } = nudgeSettings.variant;
		const { currencyKey } = getSupportRegionIdConfig(supportRegionId);
		const amount =
			productCatalog[nudgeToProduct.product]?.ratePlans[nudgeToProduct.ratePlan]
				?.pricing[currencyKey];

		if (amount) {
			const props = {
				supportRegionId,
				product: nudgeToProduct.product,
				ratePlan: nudgeToProduct.ratePlan,
				amount,
				heading: nudgeSettings.variant.nudgeCopy.heading,
				body: nudgeSettings.variant.nudgeCopy.body,
			};
			return <CheckoutNudge {...props} />;
		}
	} else if (
		new URLSearchParams(window.location.search).get('fromNudge') &&
		nudgeSettings.variant.nudgeToProduct.product === currentProduct &&
		nudgeSettings.variant.nudgeToProduct.ratePlan === currentRatePlan
	) {
		// Show the thankyou
		const { heading, body } = nudgeSettings.variant.thankyouCopy;
		return <CheckoutNudgeThankYou heading={heading} body={body} />;
	}

	// Nothing to show
	return null;
}
