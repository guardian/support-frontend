import { css } from '@emotion/react';
import { palette } from '@guardian/source/foundations';
import { productCatalogDescription } from 'helpers/productCatalog';
import type { GuardianLightCardProps } from 'pages/[countryGroupId]/components/guardianLightCard';
import { GuardianLightCard } from 'pages/[countryGroupId]/components/guardianLightCard';

export default {
	title: 'LandingPage/GuardianLight Card',
	component: GuardianLightCard,
	argTypes: {},
};

function Template(args: GuardianLightCardProps) {
	const innerContentContainer = css`
		max-width: 940px;
		margin: 0 auto;
		text-align: center;
		background-color: ${palette.brand[400]};
		padding: 25px;
	`;
	return (
		<div css={innerContentContainer}>
			<GuardianLightCard {...args} />;
		</div>
	);
}
Template.args = {} as Record<string, unknown>;
export const Default = Template.bind({});

Default.args = {
	cardPosition: 1,
	link: 'https://support.theguardian.com/uk/checkout?product=GuardianLight&ratePlan=Monthly',
	productDescription: productCatalogDescription.GuardianLight,
	ctaCopy: 'Get Guardian Light for XX/month',
};
