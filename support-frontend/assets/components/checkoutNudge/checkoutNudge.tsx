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
} from '@guardian/source/foundations';
import {
	LinkButton,
	themeButtonReaderRevenueBrand,
} from '@guardian/source/react-components';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
import { type ActiveRatePlanKey } from 'helpers/productCatalog';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import type { GeoId } from 'pages/geoIdConfig';
import { getGeoIdConfig } from 'pages/geoIdConfig';

export interface CheckoutNudgeProps {
	geoId: GeoId;
	ratePlanKey: ActiveRatePlanKey;
	recurringAmount: number;
	abTestName: string;
	abTestVariant: string | undefined;
}

const nudgeBoxOverrides = css`
	margin-top: ${space[2]}px;
	background-color: ${neutral[97]};
	border: none;
	& h3 {
		color: ${palette.brand[500]};
		${headlineBold24};
	}
	& p {
		margin-top: ${space[2]}px;
		${textSans15}
		font-weight: 700;
	}
`;

const boxContentsOverrides = css`
	display: grid;
`;

const headlineOverrides = css`
	order: 1;
`;

const bodyCopyOverrides = css`
	order: 4;
`;

const nudgeButtonOverrides = css`
	margin-top: ${space[2]}px;
	${textSans17}
	font-weight: 700;
	width: 100%;
	order: 6;
`;

export function CheckoutNudge({
	geoId,
	ratePlanKey,
	recurringAmount,
	abTestName,
	abTestVariant,
}: CheckoutNudgeProps) {
	const { currency } = getGeoIdConfig(geoId);

	if (!['Monthly', 'Annual'].includes(ratePlanKey)) {
		ratePlanKey = 'Monthly';
	}

	const ratePlanDescription = ratePlanKey === 'Monthly' ? 'month' : 'year';

	const getButtonCopy = `Support us for ${
		currency.glyph
	}${recurringAmount.toString()}/${ratePlanDescription}`;

	const tier1UrlParams = new URLSearchParams({
		product: 'Contribution',
		ratePlan: ratePlanKey,
		contribution: recurringAmount.toString(),
		nudge: 'toRegular',
	});

	// TODO: remove the force variant before go live!!!
	const buildCtaUrl = `checkout?${tier1UrlParams.toString()}#ab-abNudgeToLowRegular=${abTestVariant}`;

	const getNudgeHeadline =
		abTestVariant === 'v1'
			? 'Make a bigger impact'
			: 'Can I make a bigger impact?';

	const getNudgeCopy =
		abTestVariant === 'v1'
			? 'Regular, reliable support powers Guardian journalism in perpetuity. Please make a difference and support us monthly today. Cancel anytime.'
			: "Yes! We're grateful for any amount you can spare, but supporting us on a monthly basis helps to power Guardian journalism in perpetuity. Cancel anytime.";

	return (
		<Box cssOverrides={nudgeBoxOverrides}>
			<BoxContents cssOverrides={boxContentsOverrides}>
				<h3 css={headlineOverrides}>{getNudgeHeadline}</h3>
				<div css={bodyCopyOverrides}>
					<p>{getNudgeCopy}</p>
				</div>
				<LinkButton
					id="id_checkoutNudge"
					cssOverrides={nudgeButtonOverrides}
					isLoading={false}
					theme={themeButtonReaderRevenueBrand}
					href={buildCtaUrl}
					onClick={() => {
						trackComponentClick(
							`checkoutNudge-${abTestName}--${abTestVariant}`,
						);
					}}
				>
					{getButtonCopy}
				</LinkButton>
			</BoxContents>
		</Box>
	);
}

export interface CheckoutNudgeThankYouProps {
	abTestVariant: string | undefined;
}

const thankYouBoxOverrides = css`
	background-color: ${neutral[97]};
	border: none;
`;
const innerThankYouBoxOverrides = css`
	margin-bottom: -${space[3]}px;

	${from.tablet} {
		margin-top: -${space[3]}px;
		margin-bottom: -${space[5]}px;
	}

	${from.desktop} {
		margin-bottom: -${space[6]}px;
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
	margin-bottom: ${space[2]}px;
	${textSans15}
	font-weight: 700;
`;

const imageOverride = css`
	grid-area: image;
	align-self: flex-end;
	margin-left: ${space[2]}px;
	margin-top: ${space[2]}px;
`;

export function CheckoutNudgeThankYou({
	abTestVariant,
}: CheckoutNudgeThankYouProps) {
	const getNudgeHeadline =
		abTestVariant === 'v1'
			? 'Thank you for choosing to Support us monthly'
			: 'Thank you for choosing to support us monthly';

	const getNudgeCopy =
		abTestVariant === 'v1'
			? 'You are helping to support the future of independent journalism.'
			: 'Your support makes a huge difference in keeping our journalism free from outside influence';

	return (
		<Box cssOverrides={thankYouBoxOverrides}>
			<BoxContents cssOverrides={innerThankYouBoxOverrides}>
				<div css={nudgeThankYouBox}>
					<h3 css={headingOverride}>{getNudgeHeadline}</h3>
					<p css={copyOverride}>{getNudgeCopy}</p>
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
