import { css } from '@emotion/react';
import { palette, space } from '@guardian/source/foundations';
import { productCatalogGuardianLight } from 'helpers/productCatalog';
import type { GuardianLightCardsProps } from 'pages/[countryGroupId]/guardianLightLanding/components/guardianLightCards';
import { GuardianLightCards } from 'pages/[countryGroupId]/guardianLightLanding/components/guardianLightCards';
import { withCenterAlignment } from '../../.storybook/decorators/withCenterAlignment';
import { withSourceReset } from '../../.storybook/decorators/withSourceReset';

export default {
	title: 'LandingPage/GuardianLight Cards',
	component: GuardianLightCards,
	argTypes: {},
	decorators: [withCenterAlignment, withSourceReset],
};

function Template(args: GuardianLightCardsProps) {
	const innerContentContainer = css`
		max-width: 940px;
		margin: 0 auto;
		text-align: center;
		background-color: ${palette.brand[400]};
		padding: ${space[3]}px;
	`;
	return (
		<div css={innerContentContainer}>
			<GuardianLightCards {...args} />
		</div>
	);
}

Template.args = {} as Record<string, unknown>;
export const Default = Template.bind({});
Default.args = {
	cardsContent: [
		{
			cardPosition: 1,
			link: 'https://support.theguardian.com/uk/checkout?product=GuardianLight&ratePlan=Monthly',
			productDescription: productCatalogGuardianLight().GuardianLight,
			ctaCopy: 'Get Guardian Light for XX/month',
		},
		{
			cardPosition: 2,
			link: `https://www.theguardian.com/uk/contribute`,
			productDescription: productCatalogGuardianLight().GuardianLightGoBack,
			ctaCopy: `Go back to 'Accept all'`,
		},
	],
};
