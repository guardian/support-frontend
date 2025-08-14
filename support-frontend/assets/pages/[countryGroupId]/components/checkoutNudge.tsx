import { css } from '@emotion/react';
import {
	brand,
	headlineBold24,
	neutral,
	space,
} from '@guardian/source/foundations';
import {
	Button,
	themeButtonReaderRevenueBrand,
} from '@guardian/source/react-components';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
import type { Currency } from 'helpers/internationalisation/currency';

// TODO: determine what changes between the two different nudges (oneTime to regular and low regular to supporter+)
interface CheckoutNudgeProps {
	type: 'regular' | 'supporter+';
    currency: Currency;
    // countryGroupId: CountryGroupId;
    // currencyKey: keyof typeof currencies; 
}

const nudgeBoxOverrides = css`
	margin-top: ${space[2]}px;
	background-color: ${neutral[97]};
	& h3 {
		color: ${brand[500]};
		${headlineBold24};
	}
	& p {
		margin-top: ${space[2]}px;
		font-weight: 700;
	}
`;

const nudgeButtonOverrides = css`
	margin-top: ${space[2]}px;
	width: 100%;
`;

// const nudgeThankYouBox = css`
// 	display: flex;
// 	flex-direction: row;
// `;

// TODO: change copy for supporter+ option
const getNudgeHeadline = (type: CheckoutNudgeProps['type']) =>
	type === 'regular' ? 'Make a bigger impact' : 'Make a bigger impact';
const getNudgeCopy = (type: CheckoutNudgeProps['type']) =>
	type === 'regular'
		? 'Regular, reliable support powers Guardian journalism in perpetuity. It takes less than a minute.'
		: 'Regular, reliable support powers Guardian journalism in perpetuity. It takes less than a minute.';

// TODO: fix amount based on countryGroupId
const getButtonCopy = (
	type: CheckoutNudgeProps['type'],
	currency: CheckoutNudgeProps['currency'],
) =>
	type === 'regular'
		? `Support us for ${currency.glyph}4/month`
		: `Support us for ${currency.glyph}4/month`;

//  type, currency, currencyKey, countryGroupId 
export function CheckoutNudge({ type, currency }: CheckoutNudgeProps) {


	return (
		<Box cssOverrides={nudgeBoxOverrides}>
			<BoxContents>
				<h3>{getNudgeHeadline(type)}</h3>
				<p>{getNudgeCopy(type)}</p>
				{/* TODO: button location add parameters */}
				<Button
					id="id_checkoutNudge"
					cssOverrides={nudgeButtonOverrides}
					isLoading={false}
					theme={themeButtonReaderRevenueBrand}
				>
					{getButtonCopy(type, currency)}
				</Button>
			</BoxContents>
		</Box>
	);
}

// probably need to pass the type to ensure we're showing the correct values.
// export function CheckoutNudgeThankYou({ type, currency }: CheckoutNudgeProps) {
// 	return (
// 		<Box cssOverrides={nudgeBoxOverrides}>
// 			<BoxContents>
// 				<div css={nudgeThankYouBox}>
// 					<div>
// 						<h3>Thank you for choosing to Support us monthly</h3>
// 						<p>You are helping ensure the future of Guardian journalism.</p>
// 					</div>
// 					{/* TODO: define width, src of image */}
// 					<img />
// 				</div>
// 			</BoxContents>
// 		</Box>
// 	);
// }
