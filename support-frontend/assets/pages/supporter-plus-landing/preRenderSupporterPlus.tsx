import { PreRenderSupporterPlusLandingPage } from './preRenderSupporterPlusLandingPage';

const leftTitleSupporterPlusROW = 'Support fearless, independent journalism';
const leftTitleSupporterPlusUS = 'Make a\nyear-end gift\nto the Guardian';
const leftTitleDigiSub = 'Under no one’s thumb but yours';

export const supporterPlusLanding = (
	countryCode?: string,
	digitalCheckout?: boolean,
) => {
	let leftText;
	if (digitalCheckout) {
		leftText = leftTitleDigiSub;
	} else {
		leftText =
			countryCode === 'US'
				? leftTitleSupporterPlusUS
				: leftTitleSupporterPlusROW;
	}
	return <PreRenderSupporterPlusLandingPage leftTitleText={leftText} />;
};
