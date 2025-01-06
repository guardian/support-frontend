import { css } from '@emotion/react';
import { palette, space } from '@guardian/source/foundations';
import { productCatalogGuardianAdLite } from 'helpers/productCatalog';
import type { GuardianAdLiteCardProps } from 'pages/[countryGroupId]/guardianLightLanding/components/guardianAdLiteCard';
import { GuardianAdLiteCard } from 'pages/[countryGroupId]/guardianLightLanding/components/guardianAdLiteCard';

export default {
	title: 'LandingPage/GuardianAdLite Card',
	component: GuardianAdLiteCard,
	argTypes: {},
};

function Template(args: GuardianAdLiteCardProps) {
	const innerContentContainer = css`
		max-width: 940px;
		margin: 0 auto;
		text-align: center;
		background-color: ${palette.brand[400]};
		padding: ${space[6]}px;
	`;
	return (
		<div css={innerContentContainer}>
			<GuardianAdLiteCard {...args} />;
		</div>
	);
}
Template.args = {} as Record<string, unknown>;
export const Default = Template.bind({});

Default.args = {
	cardPosition: 1,
	link: 'https://support.theguardian.com/uk/checkout?product=GuardianLight&ratePlan=Monthly',
	productDescription: productCatalogGuardianAdLite().GuardianAdLite,
	ctaCopy: 'Get Guardian Ad-Lite for XX/month',
};
